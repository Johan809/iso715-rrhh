import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PageLayoutComponent } from '@layouts/page-layout/page-layout.component';
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { ToastManager } from '@blocks/toast/toast.manager';
import { StoreService } from '@services/store.service';
import { Persona } from '@models/persona.model';
import { PersonaService } from '@services/persona.service';
import { LabelValuePair } from 'src/app/lib/types';
import { FormConfirmComponent } from '@forms/form-confirm/form-confirm.component';
import { PersonasModalComponent } from './personas-modal/personas-modal.component';

@Component({
  standalone: true,
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrl: './personas.component.scss',
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    PageLayoutComponent,
    ProgressBarComponent,
  ],
})
export class PersonasComponent implements OnInit {
  protected where = new Persona.Where();
  protected personas: Persona[] = [];
  public EstadosList: LabelValuePair[] = [
    { value: '', label: 'Todos' },
    { value: 'true', label: 'Activo' },
    { value: 'false', label: 'Inactivo' },
  ];
  private modalOptions = {
    animation: true,
    centered: true,
    keyboard: true,
    size: 'lg',
  };

  constructor(
    public storeService: StoreService,
    private personaService: PersonaService,
    private modalService: NgbModal,
    private toast: ToastManager
  ) {}

  ngOnInit(): void {
    this.buscar();
  }

  private buscar() {
    this.storeService.isLoading.set(true);
    this.personaService
      .getAll(this.where)
      .then((data) => {
        this.personas = data;
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

    let rawValue = this.where.documento?.replace(/\D+/g, '') ?? '';

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

    this.where.documento = formattedCedula;

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

    let rawValue = this.where.telefono?.replace(/\D+/g, '') ?? '';
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

    this.where.telefono = formattedTelefono;
    event.preventDefault();
  }

  public onCrear() {
    const modalRef = this.modalService.open(
      PersonasModalComponent,
      this.modalOptions
    );

    modalRef.result.then(() => this.buscar()).catch((er) => {});
  }

  public onEdit(id: number) {
    const modalRef = this.modalService.open(
      PersonasModalComponent,
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
      '¿Está seguro que desea desactivar esta persona?';
    modalRef.result
      .then((action: boolean) => {
        if (action) {
          let persona = this.personas.find((x) => x.idsec == id);
          if (!persona) return;
          persona.estado = false;
          this.personaService
            .update(id, persona)
            .then((res) => {
              if (res)
                this.toast.quickShow(`Persona Id: ${id} desactivada`, 'info');
            })
            .catch((er) => this.toast.quickShow(er.Message))
            .finally(() => this.buscar());
        }
      })
      .catch(() => {});
  }
}
