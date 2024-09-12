import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { ToastManager } from '@blocks/toast/toast.manager';
import { RoleLevel } from '@enums/role-level.enum';
import { FormConfirmComponent } from '@forms/form-confirm/form-confirm.component';
import { StorageHelper } from '@helpers/storage.helper';
import { PageLayoutComponent } from '@layouts/page-layout/page-layout.component';
import { ExperienciaLaboral } from '@models/experiencia-laboral.model';
import { ExperienciaLaboralService } from '@services/experienciaLaboral.service';
import { StoreService } from '@services/store.service';
import { DateObject, UserInfo } from 'src/app/lib/types';
import { ExperienciaLaboralModalComponent } from './experiencia-laboral-modal/experiencia-laboral-modal.component';

@Component({
  standalone: true,
  selector: 'app-experiencias-laborales',
  templateUrl: './experiencias-laborales.component.html',
  styleUrl: './experiencias-laborales.component.scss',
  imports: [
    NgIf,
    NgFor,
    DatePipe,
    FormsModule,
    CurrencyPipe,
    PageLayoutComponent,
    ProgressBarComponent,
    NgbDatepickerModule,
  ],
})
export class ExperienciasLaboralesComponent implements OnInit {
  protected where = new ExperienciaLaboral.Where();
  protected experiencias: ExperienciaLaboral[] = [];
  private userInfo: UserInfo | null = null;

  constructor(
    public storeService: StoreService,
    private modalService: NgbModal,
    private toast: ToastManager,
    private experienciaService: ExperienciaLaboralService
  ) {}

  ngOnInit(): void {
    this.userInfo = StorageHelper.getUserInfo();
    this.buscar();
  }

  private buscar() {
    this.storeService.isLoading.set(true);
    if (this.userInfo && this.userInfo.role === RoleLevel.USER) {
      this.where.user_name = this.userInfo.username;
    }

    this.where.initDates();
    this.experienciaService
      .getAll(this.where)
      .then((data) => {
        this.experiencias = data;
      })
      .catch((err) => console.error(err))
      .finally(() => this.storeService.isLoading.set(false));
  }

  public onBuscar() {
    this.buscar();
  }

  public toDate(value: Date | string | DateObject | undefined): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;

    if (typeof value == 'string') return new Date(value);

    if (typeof value === 'object') {
      return new Date(value.year, value.month - 1, value.day);
    }
    return null;
  }

  public onCrear() {
    const modalRef = this.modalService.open(ExperienciaLaboralModalComponent, {
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
    const modalRef = this.modalService.open(ExperienciaLaboralModalComponent, {
      animation: true,
      centered: true,
      keyboard: true,
    });

    modalRef.componentInstance.IdSec = id;
    modalRef.result
      .then(() => {
        this.buscar();
      })
      .catch(() => {});
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
          this.experienciaService
            .delete(id)
            .then((res) => {
              if (res)
                this.toast.quickShow(
                  `Experiencia Laboral Id: ${id} eliminada`,
                  'info'
                );
            })
            .catch((er) => this.toast.quickShow(er.Message))
            .finally(() => this.buscar());
        }
      })
      .catch(() => {});
  }
}
