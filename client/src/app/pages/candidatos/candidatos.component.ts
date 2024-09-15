import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { ToastManager } from '@blocks/toast/toast.manager';
import { FormConfirmComponent } from '@forms/form-confirm/form-confirm.component';
import { PageLayoutComponent } from '@layouts/page-layout/page-layout.component';
import { StoreService } from '@services/store.service';
import { LabelValuePair, UserInfo } from 'src/app/lib/types';
import { RoleLevel } from '@enums/role-level.enum';
import { CandidatoService } from '@services/candidato.service';
import { Candidato } from '@models/candidato.model';
import { StorageHelper } from '@helpers/storage.helper';
import { ObjectHelper } from 'src/app/lib/object.helper';
import { Puesto } from '@models/puesto.model';
import { PuestoService } from '@services/puesto.service';

@Component({
  standalone: true,
  selector: 'app-candidatos',
  templateUrl: './candidatos.component.html',
  styleUrl: './candidatos.component.scss',
  imports: [
    NgIf,
    NgFor,
    PageLayoutComponent,
    ProgressBarComponent,
    CurrencyPipe,
    FormsModule,
    AutocompleteLibModule,
  ],
})
export class CandidatosComponent implements OnInit {
  protected where = new Candidato.Where();
  protected candidatos: Candidato[] = [];
  protected puestos: Puesto[] = [];
  protected titulo: string = 'Candidatos';
  public EstadosList: LabelValuePair[] = [
    { label: 'Todos', value: '' },
    ...Candidato.ESTADOS_LIST,
  ];

  public userRole: RoleLevel = RoleLevel.USER;
  private userInfo: UserInfo | null;

  constructor(
    public storeService: StoreService,
    private modalService: NgbModal,
    private toast: ToastManager,
    private candidatoService: CandidatoService,
    private puestoService: PuestoService,
    private router: Router
  ) {
    this.userInfo = StorageHelper.getUserInfo();
    this.userRole = this.userInfo?.role || RoleLevel.USER;
  }

  ngOnInit(): void {
    this.setupScreen();
    this.buscar();
    this.buscarPuestos();
  }

  private setupScreen(): void {
    if (this.userRole === RoleLevel.USER) {
      this.titulo = 'Postulaciones';
      // Filtrar por el usuario
      this.where.user_name = this.userInfo?.username;
    } else {
      this.titulo = 'Candidatos';
    }
  }

  private buscar(): void {
    this.storeService.isLoading.set(true);
    this.candidatoService
      .getAll(this.where)
      .then((res) => {
        res.map((c) => {
          const data = ObjectHelper.CopyObject(new Candidato(), c);
          this.candidatos.push(data);
        });
      })
      .catch((err) => console.error(err))
      .finally(() => this.storeService.isLoading.set(false));
  }

  private buscarPuestos(): void {
    this.puestoService
      .getAll({ estado: 'A' })
      .then((data) => (this.puestos = data))
      .catch((err) => console.error(err));
  }

  public getPuestoNombre(puesto: Puesto | number | undefined): string {
    return (<Puesto>puesto).nombre;
  }

  public onBuscar(): void {
    this.buscar();
  }

  public onEdit(id: number): void {
    this.router.navigate([`/postulacion`], { queryParams: { Id: id } });
  }

  public onVer(id: number): void {
    this.router.navigate([`/postulacion`], {
      queryParams: { Id: id, EsVer: true },
    });
  }

  public onCancelar(id: number) {
    const modalRef = this.modalService.open(FormConfirmComponent, {
      animation: true,
      centered: true,
      keyboard: true,
    });

    modalRef.componentInstance.message =
      '¿Está seguro que desea cancelar esta postulación?';
    modalRef.result
      .then((action: boolean) => {
        if (action) {
          let candidato = this.candidatos.find((x) => x.idsec == id);
          if (!candidato) return;
          candidato.estado = Candidato.ESTADOS.INACTIVO;
          this.candidatoService
            .update(id, candidato)
            .then((res) => {
              if (res)
                this.toast.quickShow(`Postulación Id: ${id} cancelada`, 'info');
            })
            .catch((er) => this.toast.quickShow(er.Message))
            .finally(() => this.buscar());
        }
      })
      .catch(() => {});
  }

  public selectEvent(puesto: Puesto) {
    if (puesto) {
      this.where.puestoIdSec = puesto.idsec;
    }
  }
}
