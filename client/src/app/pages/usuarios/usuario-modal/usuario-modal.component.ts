import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { ToastManager } from '@blocks/toast/toast.manager';
import { Usuario } from '@models/usuario.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioService } from '@services/usuario.service';
import { StoreService } from '@services/store.service';
import { ObjectHelper } from 'src/app/lib/object.helper';
import { LabelValuePair, RoleType } from 'src/app/lib/types';
import { RoleLevel } from '@enums/role-level.enum';

@Component({
  standalone: true,
  selector: 'app-usuario-modal',
  templateUrl: './usuario-modal.component.html',
  styleUrl: './usuario-modal.component.scss',
  imports: [NgIf, NgFor, ProgressBarComponent, FormsModule],
})
export class UsuarioModalComponent implements OnInit {
  @Input('idsec') IdSec: number = 0;
  protected modalTitle: string = 'Nuevo Usuario';
  protected usuario: Usuario;
  public RolesList: LabelValuePair[] = [
    { label: 'Candidato', value: RoleLevel.USER },
    { label: 'Recursos Humanos', value: RoleLevel.RRHH },
    { label: 'Administrador', value: RoleLevel.ADMIN },
  ];
  public EstadosList: LabelValuePair[] = [
    { label: 'Activo', value: 'true' },
    { label: 'Inactivo', value: 'false' },
  ];

  // Variables para gestionar el cambio de contraseña
  public isChangingPassword: boolean = false;
  public oldPassword: string = '';
  public newPassword: string = '';

  constructor(
    protected activeModal: NgbActiveModal,
    protected storeService: StoreService,
    private toast: ToastManager,
    private usuarioService: UsuarioService
  ) {
    this.storeService.isLoading.set(false);
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if (this.IdSec > 0) {
      this.modalTitle = `Usuario (Id: ${this.IdSec})`;
      this.cargar();
    }
  }

  private async cargar() {
    this.storeService.isLoading.set(true);
    const data = await this.usuarioService.getOne(this.IdSec);
    this.usuario = ObjectHelper.CopyObject(new Usuario(), data);
    this.usuario.role = (<RoleType>this.usuario.role).idsec;
    this.storeService.isLoading.set(false);
  }

  private async grabar(): Promise<void> {
    try {
      this.storeService.isLoading.set(true);

      if (this.IdSec == 0) {
        await this.usuarioService.create(this.usuario);
      } else {
        await this.usuarioService.update(this.IdSec, this.usuario);
      }

      this.toast.quickShow('Usuario grabado con éxito.', 'success', true);
      this.activeModal.close({ success: true });
    } catch (err) {
      console.error(err);
    } finally {
      this.storeService.isLoading.set(false);
    }
  }

  public async changePassword(): Promise<void> {
    if (!this.oldPassword || !this.newPassword) {
      this.toast.quickShow('Ambos campos son obligatorios', 'warning', true);
      return;
    }

    try {
      this.storeService.isLoading.set(true);
      await this.usuarioService.updatePassword(
        this.IdSec,
        this.oldPassword,
        this.newPassword
      );
      this.toast.quickShow(
        'Contraseña actualizada con éxito.',
        'success',
        true
      );
      this.isChangingPassword = false; // Ocultar formulario de cambio de contraseña
    } catch (err) {
      this.toast.quickShow(
        'Error al actualizar la contraseña.',
        'danger',
        true
      );
    } finally {
      this.storeService.isLoading.set(false);
    }
  }

  private validate(): boolean {
    let warningMsg: string[] = [];

    if (!this.usuario.nombre) warningMsg.push('El campo nombre es requerido');

    if (!this.usuario.email) {
      warningMsg.push('El campo email es requerido');
    } else if (!this.isValidEmail(this.usuario.email)) {
      warningMsg.push('El formato del email no es válido');
    }

    if (!this.usuario.role) warningMsg.push('El campo rol es requerido');

    if (!this.usuario.estado && this.usuario.estado !== false) {
      warningMsg.push('El campo estado es requerido');
    }

    if (this.IdSec === 0) {
      if (!this.usuario.password) {
        warningMsg.push('El campo contraseña es requerido');
      } else if (this.usuario.password.length < 6) {
        warningMsg.push('La contraseña debe tener al menos 6 caracteres');
      }
    }

    if (warningMsg.length > 0) {
      warningMsg.forEach((msg: string) => {
        this.toast.quickShow(msg, 'warning', true);
      });
    }

    return warningMsg.length === 0;
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return emailPattern.test(email);
  }

  public onGrabarClick(event: Event) {
    event.preventDefault();
    if (this.validate()) this.grabar();
  }
}
