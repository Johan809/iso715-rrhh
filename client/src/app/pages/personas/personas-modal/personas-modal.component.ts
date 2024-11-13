import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { ToastManager } from '@blocks/toast/toast.manager';
import { Persona } from '@models/persona.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonaService } from '@services/persona.service';
import { StoreService } from '@services/store.service';
import { ObjectHelper } from 'src/app/lib/helpers';

@Component({
  standalone: true,
  selector: 'app-persona-modal',
  templateUrl: './personas-modal.component.html',
  styleUrl: './personas-modal.component.scss',
  imports: [NgIf, NgFor, ProgressBarComponent, FormsModule],
})
export class PersonasModalComponent implements OnInit {
  @Input('idsec') IdSec: number = 0;
  protected modalTitle: string = 'Nueva Persona';
  protected persona: Persona;

  public EstadosList = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  constructor(
    protected activeModal: NgbActiveModal,
    protected storeService: StoreService,
    private toast: ToastManager,
    private personaService: PersonaService
  ) {
    this.storeService.isLoading.set(false);
    this.persona = new Persona();
  }

  ngOnInit(): void {
    if (this.IdSec > 0) {
      this.modalTitle = `Persona (Id: ${this.IdSec})`;
      this.cargar();
    }
  }

  public onDocumentoKeyDown(event: KeyboardEvent) {
    const controlKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
    ];
    if (controlKeys.includes(event.key)) {
      return;
    }

    const isNumber = /^[0-9]$/.test(event.key);
    if (!isNumber) {
      event.preventDefault();
      return;
    }

    let rawValue = this.persona.documento?.replace(/\D+/g, '') ?? '';
    rawValue += event.key;

    if (rawValue.length > 11) {
      event.preventDefault();
      return;
    }

    let formattedCedula = rawValue;
    if (rawValue.length > 3) {
      formattedCedula = `${rawValue.slice(0, 3)}-${rawValue.slice(3)}`;
    }
    if (rawValue.length > 10) {
      formattedCedula = `${rawValue.slice(0, 3)}-${rawValue.slice(
        3,
        10
      )}-${rawValue.slice(10)}`;
    }

    this.persona.documento = formattedCedula;
    event.preventDefault();
  }

  public onTelefonoKeyDown(event: KeyboardEvent) {
    const controlKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
    ];
    if (controlKeys.includes(event.key)) {
      return;
    }

    const isNumber = /^[0-9]$/.test(event.key);
    if (!isNumber) {
      event.preventDefault();
      return;
    }

    let rawValue = this.persona.telefono?.replace(/\D+/g, '') ?? '';
    rawValue += event.key;

    if (rawValue.length > 10) {
      event.preventDefault();
      return;
    }

    let formattedTelefono = rawValue;
    if (rawValue.length > 3) {
      formattedTelefono = `(${rawValue.slice(0, 3)}) ${rawValue.slice(3)}`;
    }
    if (rawValue.length > 6) {
      formattedTelefono = `(${rawValue.slice(0, 3)}) ${rawValue.slice(
        3,
        6
      )}-${rawValue.slice(6)}`;
    }

    this.persona.telefono = formattedTelefono;
    event.preventDefault();
  }

  private async cargar() {
    this.storeService.isLoading.set(true);
    const data = await this.personaService.getOne(this.IdSec);
    this.persona = ObjectHelper.CopyObject(new Persona(), data);
    this.storeService.isLoading.set(false);
  }

  private async grabar(): Promise<void> {
    try {
      this.storeService.isLoading.set(true);

      if (this.IdSec == 0) {
        await this.personaService.create(this.persona);
      } else {
        await this.personaService.update(this.IdSec, this.persona);
      }

      this.toast.quickShow('Persona grabada con éxito.', 'success', true);
      this.activeModal.close({ success: true });
    } catch (err) {
      this.toast.quickShow('Error al grabar la persona.', 'danger', true);
    } finally {
      this.storeService.isLoading.set(false);
    }
  }

  private validate(): boolean {
    const warningMsg: string[] = [];

    if (!this.persona.nombre) warningMsg.push('El campo nombre es requerido');
    if (!this.persona.email) {
      warningMsg.push('El campo email es requerido');
    } else if (!this.isValidEmail(this.persona.email)) {
      warningMsg.push('El formato del email no es válido');
    }
    if (!this.persona.documento)
      warningMsg.push('El campo documento es requerido');
    if (this.persona.estado === undefined)
      warningMsg.push('El campo estado es requerido');

    if (this.persona.telefono && !this.isValidPhone(this.persona.telefono)) {
      warningMsg.push('El formato del teléfono no es válido');
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

  private isValidPhone(phone: string): boolean {
    const phonePattern = /^(?:\(\d{3}\)|\d{3})[-\s]?\d{3}[-\s]?\d{4}$/;
    return phonePattern.test(phone);
  }

  public onGrabarClick(event: Event) {
    event.preventDefault();
    if (this.validate()) this.grabar();
  }
}
