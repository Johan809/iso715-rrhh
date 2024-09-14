import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { ToastManager } from '@blocks/toast/toast.manager';
import { FormConfirmComponent } from '@forms/form-confirm/form-confirm.component';
import { PageLayoutComponent } from '@layouts/page-layout/page-layout.component';
import { Usuario } from '@models/usuario.model';
import { UsuarioService } from '@services/usuario.service';
import { StoreService } from '@services/store.service';
import { LabelValuePair, RoleType } from 'src/app/lib/types';
import { UsuarioModalComponent } from './usuario-modal/usuario-modal.component';
import { RoleLevel } from '@enums/role-level.enum';

@Component({
  standalone: true,
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    PageLayoutComponent,
    ProgressBarComponent,
    NgbDatepickerModule,
  ],
})
export class UsuariosComponent implements OnInit {
  protected where = new Usuario.Where();
  protected usuarios: Usuario[] = [];
  public EstadosList: LabelValuePair[] = [
    { value: '', label: 'Todos' },
    { value: 'true', label: 'Activo' },
    { value: 'false', label: 'Inactivo' },
  ];
  private modalOptions = {
    animation: true,
    centered: true,
    keyboard: true,
  };

  constructor(
    public storeService: StoreService,
    private usuarioService: UsuarioService,
    private modalService: NgbModal,
    private toast: ToastManager
  ) {}

  ngOnInit(): void {
    this.buscar();
  }

  private buscar() {
    this.storeService.isLoading.set(true);
    this.usuarioService
      .getAll(this.where)
      .then((data) => {
        this.usuarios = data;
      })
      .catch((err) => console.error(err))
      .finally(() => this.storeService.isLoading.set(false));
  }

  public onBuscar() {
    this.buscar();
  }

  public getEstadoLabel(estado: boolean): string {
    return estado ? 'Activo' : 'Inactivo';
  }

  public getRoleNombre(role: RoleType | number): string {
    if (typeof role == 'object') {
      return (<RoleType>role).nombre;
    } else {
      switch (role) {
        case RoleLevel.USER:
          return 'Candidato';
        case RoleLevel.RRHH:
          return 'Recursos Humanos';
        case RoleLevel.ADMIN:
          return 'Administrador';
        default:
          return '';
      }
    }
  }

  public onCrear() {
    const modalRef = this.modalService.open(
      UsuarioModalComponent,
      this.modalOptions
    );

    modalRef.result.then(() => this.buscar()).catch((er) => {});
  }

  public onEdit(id: number) {
    const modalRef = this.modalService.open(
      UsuarioModalComponent,
      this.modalOptions
    );

    modalRef.componentInstance.IdSec = id;
    modalRef.result.then(() => this.buscar()).catch(() => {});
  }

  public onDelete(id: number) {
    const modalRef = this.modalService.open(FormConfirmComponent, {
      animation: true,
      centered: true,
      keyboard: true,
    });

    modalRef.componentInstance.message =
      '¿Está seguro que desea desactivar este usuario?';
    modalRef.result
      .then((action: boolean) => {
        if (action) {
          let usuario = this.usuarios.find((x) => x.idsec == id);
          if (!usuario) return;
          usuario.estado = false;
          this.usuarioService
            .update(id, usuario)
            .then((res) => {
              if (res)
                this.toast.quickShow(`Usuario Id: ${id} desactivado`, 'info');
            })
            .catch((er) => this.toast.quickShow(er.Message))
            .finally(() => this.buscar());
        }
      })
      .catch(() => {});
  }
}
