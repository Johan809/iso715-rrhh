import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { ToastManager } from '@blocks/toast/toast.manager';
import { StorageHelper } from '@helpers/storage.helper';
import { Capacitacion } from '@models/capacitacion.model';
import {
  NgbActiveModal,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { CapacitacionService } from '@services/capacitacion.service';
import { StoreService } from '@services/store.service';
import { DateObject } from 'src/app/lib/types';

@Component({
  standalone: true,
  selector: 'app-capacitacion-modal',
  templateUrl: './capacitacion-modal.component.html',
  styleUrl: './capacitacion-modal.component.scss',
  imports: [
    NgIf,
    NgFor,
    ProgressBarComponent,
    FormsModule,
    NgbDatepickerModule,
  ],
})
export class CapacitacionModalComponent implements OnInit {
  @Input('idsec') IdSec: number = 0;
  protected modalTitle: string = 'Nueva Capacitación';
  protected capacitacion: Capacitacion;
  public NivelList = [...Capacitacion.NIVELES];

  constructor(
    protected activeModal: NgbActiveModal,
    protected storeService: StoreService,
    private toast: ToastManager,
    private capacitacionService: CapacitacionService
  ) {
    this.storeService.isLoading.set(false);
    this.capacitacion = new Capacitacion();
  }

  ngOnInit(): void {
    if (this.IdSec > 0) {
      this.modalTitle = `Capacitación (Id: ${this.IdSec})`;
      this.cargar();
    }
  }

  private async cargar() {
    this.storeService.isLoading.set(true);
    this.capacitacion = await this.capacitacionService.getOne(this.IdSec);
    console.log('capacitacion', this.capacitacion);
    this.capacitacion.fechaDesde = this.convertDate(
      <string>this.capacitacion.fechaDesde
    );
    this.capacitacion.fechaHasta = this.convertDate(
      <string>this.capacitacion.fechaHasta
    );
    this.storeService.isLoading.set(false);
  }

  private convertDate(fecha: string): DateObject | string {
    if (fecha) {
      let date = new Date(fecha);
      return <DateObject>{
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDay(),
      };
    } else return '';
  }

  private async grabar(): Promise<void> {
    try {
      this.storeService.isLoading.set(true);
      this.capacitacion.user_name = StorageHelper.getUserInfo()?.username;

      if (this.IdSec == 0) {
        await this.capacitacionService.create(this.capacitacion);
      } else {
        await this.capacitacionService.update(this.IdSec, this.capacitacion);
      }

      this.storeService.isLoading.set(false);
      this.toast.quickShow('Capacitación grabada con éxito.', 'success', true);
      this.activeModal.close({ success: true });
    } catch (err) {
      this.toast.quickShow('Ha ocurrido un error', 'danger', true);
    }
  }

  private validate(): boolean {
    let warningMsg = [];

    if (!this.capacitacion.descripcion)
      warningMsg.push('El campo descripción es requerido');
    if (!this.capacitacion.nivel)
      warningMsg.push('El campo nivel es requerido');
    if (!this.capacitacion.fechaDesde)
      warningMsg.push('El campo fecha desde es requerido');
    if (!this.capacitacion.fechaHasta)
      warningMsg.push('El campo fecha hasta es requerido');
    if (this.capacitacion.fechaDesde && this.capacitacion.fechaHasta) {
      this.capacitacion.initDates();
      if (this.capacitacion.fechaDesde > this.capacitacion.fechaHasta) {
        warningMsg.push('El rango de fechas seleccionadas no es válido');
      }
    }
    if (!this.capacitacion.institucion)
      warningMsg.push('El campo institución es requerido');

    if (warningMsg.length > 0) {
      warningMsg.forEach((msg: string) => {
        this.toast.quickShow(msg, 'warning', true);
      });
    }

    return warningMsg.length == 0;
  }

  public onGrabarClick(event: Event) {
    event.preventDefault();
    if (this.validate()) this.grabar();
  }
}
