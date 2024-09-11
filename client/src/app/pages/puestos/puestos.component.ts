import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { ToastManager } from '@blocks/toast/toast.manager';
import { FormConfirmComponent } from '@forms/form-confirm/form-confirm.component';
import { PageLayoutComponent } from '@layouts/page-layout/page-layout.component';
import { Puesto } from '@models/puesto.model';
import { PuestoService } from '@services/puesto.service';
import { StoreService } from '@services/store.service';
import { LabelValuePair } from 'src/app/lib/types';
import { PuestoModalComponent } from './puesto-modal/puesto-modal.component';

@Component({
  standalone: true,
  selector: 'app-puestos',
  templateUrl: './puestos.component.html',
  styleUrl: './puestos.component.scss',
  imports: [
    NgIf,
    NgFor,
    DatePipe,
    FormsModule,
    PageLayoutComponent,
    ProgressBarComponent,
    NgbDatepickerModule,
  ],
})
export class PuestosComponent implements OnInit {
  protected where = new Puesto.Where();
  protected puestos: Puesto[] = [];
  public RiesgoList: LabelValuePair[] = [
    { value: '', label: 'Todos', ...Puesto.NivelRiesgoList },
  ];

  constructor(
    public storeService: StoreService,
    private puestoService: PuestoService,
    private modalService: NgbModal,
    private toast: ToastManager
  ) {}

  ngOnInit(): void {
    this.buscar();
  }

  private buscar() {
    this.storeService.isLoading.set(true);
    this.puestoService
      .getAll(this.where)
      .then((data) => {
        this.puestos = data;
      })
      .catch((err) => console.error(err))
      .finally(() => this.storeService.isLoading.set(false));
  }

  public onBuscar() {
    this.buscar();
  }

  public onCrear() {
    const modalRef = this.modalService.open(PuestoModalComponent, {
      animation: true,
      centered: true,
      keyboard: true,
    });

    modalRef.result.then(() => this.buscar()).catch((er) => {});
  }

  public onEdit(id: number) {
    const modalRef = this.modalService.open(PuestoModalComponent, {
      animation: true,
      centered: true,
      keyboard: true,
    });

    modalRef.componentInstance.IdSec = id;
    modalRef.result.then(() => this.buscar()).catch(() => {});
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
          this.puestoService
            .delete(id)
            .then((res) => {
              if (res)
                this.toast.quickShow(`Puesto Id: ${id} eliminado`, 'info');
            })
            .catch((er) => this.toast.quickShow(er.Message))
            .finally(() => this.buscar());
        }
      })
      .catch(() => {});
  }
}
