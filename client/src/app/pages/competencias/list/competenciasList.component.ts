import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { PageLayoutComponent } from '@layouts/page-layout/page-layout.component';
import { Competencia } from '@models/competencia.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompetenciaService } from '@services/competencia.service';
import { StoreService } from '@services/store.service';
import { ModalCompetenciaComponent } from '../modal/modal-competencia.component';
import { FormConfirmComponent } from '@forms/form-confirm/form-confirm.component';
import { ToastManager } from '@blocks/toast/toast.manager';

@Component({
  selector: 'app-competencias',
  standalone: true,
  templateUrl: './competenciasList.component.html',
  styleUrl: './competenciasList.component.scss',
  imports: [
    NgIf,
    NgFor,
    PageLayoutComponent,
    ProgressBarComponent,
    FormsModule,
    DatePipe,
  ],
})
export class CompetenciasListComponent implements OnInit {
  public where = new Competencia.Where();
  public competencias: Competencia[] = [];

  constructor(
    public storeService: StoreService,
    private competenciaService: CompetenciaService,
    private modalService: NgbModal,
    private toast: ToastManager
  ) {}

  ngOnInit(): void {
    this.buscar();
  }

  private buscar() {
    this.storeService.isLoading.set(true);
    this.competenciaService
      .getAll(this.where)
      .then((data) => {
        this.competencias = data;
        console.log('buscar', this.competencias);
      })
      .catch((err) => console.error(err))
      .finally(() => this.storeService.isLoading.set(false));
  }

  public onBuscar() {
    this.buscar();
  }

  public onCrear() {
    console.log('onCrear');
    const modalRef = this.modalService.open(ModalCompetenciaComponent, {
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
    const modalRef = this.modalService.open(ModalCompetenciaComponent, {
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
          this.competenciaService
            .delete(id)
            .then((res) => {
              if (res)
                this.toast.quickShow(`Competencia Id: ${id} eliminada`, 'info');
            })
            .catch((er) => this.toast.quickShow(er.Message))
            .finally(() => this.buscar());
        }
      })
      .catch((err) => console.error(err));
  }
}
