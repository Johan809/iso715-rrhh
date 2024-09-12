import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { ToastManager } from '@blocks/toast/toast.manager';
import { StorageHelper } from '@helpers/storage.helper';
import { ExperienciaLaboral } from '@models/experiencia-laboral.model';
import {
  NgbActiveModal,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ExperienciaLaboralService } from '@services/experienciaLaboral.service';
import { StoreService } from '@services/store.service';
import { DateObject } from 'src/app/lib/types';

@Component({
  standalone: true,
  selector: 'app-experiencia-laboral-modal',
  templateUrl: './experiencia-laboral-modal.component.html',
  styleUrl: './experiencia-laboral-modal.component.scss',
  imports: [
    NgIf,
    NgFor,
    ProgressBarComponent,
    FormsModule,
    NgbDatepickerModule,
  ],
})
export class ExperienciaLaboralModalComponent implements OnInit {
  @Input('idsec') IdSec: number = 0;
  protected modalTitle: string = 'Nueva Experiencia Laboral';
  protected experiencia: ExperienciaLaboral;

  constructor(
    public activeModal: NgbActiveModal,
    public storeService: StoreService,
    private toast: ToastManager,
    private experienciaService: ExperienciaLaboralService
  ) {
    this.storeService.isLoading.set(false);
    this.experiencia = new ExperienciaLaboral();
  }

  ngOnInit(): void {
    if (this.IdSec > 0) {
      this.modalTitle = `Editar Experiencia Laboral (Id: ${this.IdSec})`;
      this.cargar();
    }
  }

  private async cargar() {
    this.storeService.isLoading.set(true);
    this.experiencia = await this.experienciaService.getOne(this.IdSec);
    this.storeService.isLoading.set(false);
  }

  private async grabar() {
    try {
      this.storeService.isLoading.set(true);
      this.experiencia.user_name = StorageHelper.getUserInfo()?.username;

      if (this.IdSec === 0) {
        await this.experienciaService.create(this.experiencia);
      } else {
        await this.experienciaService.update(this.IdSec, this.experiencia);
      }

      this.toast.quickShow(
        'Experiencia laboral guardada con éxito',
        'success',
        true
      );
      this.activeModal.close({ success: true });
    } catch (error) {
      this.toast.quickShow(
        'Ocurrió un error al guardar la experiencia laboral',
        'danger',
        true
      );
    } finally {
      this.storeService.isLoading.set(false);
    }
  }

  private validate(): boolean {
    let warningMsg = [];

    if (!this.experiencia.empresa)
      warningMsg.push('El campo empresa es requerido');
    if (!this.experiencia.puestoOcupado)
      warningMsg.push('El campo puesto ocupado es requerido');
    if (!this.experiencia.fechaDesde)
      warningMsg.push('El campo fecha desde es requerido');
    if (!this.experiencia.fechaHasta)
      warningMsg.push('El campo fecha hasta es requerido');

    if (this.experiencia.fechaDesde && this.experiencia.fechaHasta) {
      this.experiencia.initDates();
      if (this.experiencia.fechaDesde > this.experiencia.fechaHasta) {
        warningMsg.push('El rango de fechas seleccionadas no es válido');
      }
    }

    if (warningMsg.length > 0) {
      warningMsg.forEach((msg) => this.toast.quickShow(msg, 'warning', true));
    }

    return warningMsg.length === 0;
  }

  public onGrabarClick(event: Event) {
    event.preventDefault();
    if (this.validate()) this.grabar();
  }
}
