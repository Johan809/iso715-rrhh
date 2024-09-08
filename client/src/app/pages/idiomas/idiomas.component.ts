import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { ToastManager } from '@blocks/toast/toast.manager';
import { FormConfirmComponent } from '@forms/form-confirm/form-confirm.component';
import { PageLayoutComponent } from '@layouts/page-layout/page-layout.component';
import { Idioma } from '@models/idioma.model';
import { IdiomaService } from '@services/idioma.service';
import { StoreService } from '@services/store.service';
import { IdiomaModalComponent } from './idioma-modal/idioma-modal.component';

@Component({
  selector: 'app-idiomas',
  standalone: true,
  templateUrl: './idiomas.component.html',
  styleUrl: './idiomas.component.scss',
  imports: [
    NgIf,
    NgFor,
    DatePipe,
    FormsModule,
    PageLayoutComponent,
    ProgressBarComponent,
  ],
})
export class IdiomasComponent implements OnInit {
  protected where = new Idioma.Where();
  protected idiomas: Idioma[] = [];

  constructor(
    public storeService: StoreService,
    private idiomaService: IdiomaService,
    private modalService: NgbModal,
    private toast: ToastManager
  ) {}

  ngOnInit(): void {
    this.buscar();
  }

  private buscar() {
    this.storeService.isLoading.set(true);
    this.idiomaService
      .getAll(this.where)
      .then((data) => {
        this.idiomas = data;
      })
      .catch((err) => console.error(err))
      .finally(() => this.storeService.isLoading.set(false));
  }

  public onBuscar() {
    this.buscar();
  }

  public onCrear() {
    const modalRef = this.modalService.open(IdiomaModalComponent, {
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
    const modalRef = this.modalService.open(IdiomaModalComponent, {
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
          this.idiomaService
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
