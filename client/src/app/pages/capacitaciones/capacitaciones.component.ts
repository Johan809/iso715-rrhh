import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { ToastManager } from '@blocks/toast/toast.manager';
import { FormConfirmComponent } from '@forms/form-confirm/form-confirm.component';
import { PageLayoutComponent } from '@layouts/page-layout/page-layout.component';
import { Capacitacion } from '@models/capacitacion.model';
import { CapacitacionService } from '@services/capacitacion.service';
import { StoreService } from '@services/store.service';
import { CapacitacionWhere } from 'src/app/lib/types';
import { CapacitacionModalComponent } from './capacitacion-modal/capacitacion-modal.component';

@Component({
  selector: 'app-capacitaciones',
  standalone: true,
  templateUrl: './capacitaciones.component.html',
  styleUrl: './capacitaciones.component.scss',
  imports: [
    NgIf,
    NgFor,
    DatePipe,
    FormsModule,
    PageLayoutComponent,
    ProgressBarComponent,
  ],
})
export class CapacitacionesComponent implements OnInit {
  protected where: CapacitacionWhere = new Capacitacion.Where();
  protected capacitaciones: Capacitacion[] = [];
  public NivelList = [{ value: '', label: 'Todos' }, ...Capacitacion.NIVELES];

  constructor(
    public storeService: StoreService,
    private capacitacionService: CapacitacionService,
    private modalService: NgbModal,
    private toast: ToastManager
  ) {}

  ngOnInit(): void {
    this.buscar();
  }

  private buscar() {
    this.storeService.isLoading.set(true);
    this.capacitacionService
      .getAll(this.where)
      .then((data) => {
        this.capacitaciones = data;
      })
      .catch((err) => console.error(err))
      .finally(() => this.storeService.isLoading.set(false));
  }

  public onBuscar() {
    this.buscar();
  }

  public onCrear() {
    const modalRef = this.modalService.open(CapacitacionModalComponent, {
      animation: true,
      centered: true,
      keyboard: true,
    });

    modalRef.result
      .then(() => {
        this.buscar();
      })
      .catch((er) => console.error(er));
  }

  public onEdit(id: number) {
    const modalRef = this.modalService.open(CapacitacionModalComponent, {
      animation: true,
      centered: true,
      keyboard: true,
    });

    modalRef.componentInstance.IdSec = id;
    modalRef.result
      .then(() => {
        this.buscar();
      })
      .catch((er) => console.error(er));
  }

  public onDelete(id: number) {
    const modalRef = this.modalService.open(FormConfirmComponent, {
      animation: true,
      centered: true,
      keyboard: true,
    });

    modalRef.result
      .then((action: boolean) => {
        if (action) {
          this.capacitacionService
            .delete(id)
            .then((res) => {
              if (res)
                this.toast.quickShow(`Idioma Id: ${id} eliminado`, 'info');
            })
            .catch((er) => this.toast.quickShow(er.Message))
            .finally(() => this.buscar());
        }
      })
      .catch((err) => console.error(err));
  }
}
