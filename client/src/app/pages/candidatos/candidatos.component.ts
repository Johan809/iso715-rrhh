import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { Competencia } from '@models/competencia.model';
import { Capacitacion } from '@models/capacitacion.model';
import { CompetenciaService } from '@services/competencia.service';
import { CapacitacionService } from '@services/capacitacion.service';
import { ESTADOS_DEFECTO } from 'src/app/lib/constants';

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
  protected competencias: Competencia[] = [];
  protected capacitaciones: Capacitacion[] = [];
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
    private competenciaService: CompetenciaService,
    private capacitacionService: CapacitacionService,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {
    this.userInfo = StorageHelper.getUserInfo();
    this.userRole = this.userInfo?.role || RoleLevel.USER;
  }

  ngOnInit(): void {
    this.setupScreen();
    this.buscar();
    this.buscarEntidades();
  }

  private setupScreen(): void {
    if (this.userRole === RoleLevel.USER) {
      this.titulo = 'Postulaciones';
      this.where.user_name = this.userInfo?.username;
    } else {
      this.titulo = 'Candidatos';
    }
  }

  private buscar(): void {
    this.candidatos = [];
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

  private buscarEntidades(): void {
    this.puestoService
      .getAll({ estado: ESTADOS_DEFECTO.ACTIVO })
      .then((data) => (this.puestos = data))
      .catch((err) => console.error('puesto', err));

    this.competenciaService
      .getAll({ estado: ESTADOS_DEFECTO.ACTIVO })
      .then((data) => (this.competencias = data))
      .catch((err) => console.error('competencia', err));

    this.capacitacionService
      .getAll({})
      .then((data) => (this.capacitaciones = data))
      .catch((err) => console.error('capacitacion', err));
  }

  public getPuestoNombre(puesto: Puesto | number | undefined): string {
    return (<Puesto>puesto).nombre;
  }

  public getEstadoNombre(estado: string): string {
    switch (estado) {
      case Candidato.ESTADOS.ACTIVO:
        return Candidato.ESTADOS.ACTIVO_LABEL;
      case Candidato.ESTADOS.CONTRATADO:
        return Candidato.ESTADOS.CONTRATADO_LABEL;
      case Candidato.ESTADOS.INACTIVO:
        return Candidato.ESTADOS.INACTIVO_LABEL;
      case Candidato.ESTADOS.RECHAZADO:
        return Candidato.ESTADOS.RECHAZADO_LABEL;
      default:
        return '';
    }
  }

  public onBuscar(): void {
    this.buscar();
  }

  public onEdit(id: number): void {
    this.router.navigate([`/postulacion`], { queryParams: { Id: id } });
  }

  public onCrear(): void {
    this.router.navigate([`/postulacion`]);
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
    if (puesto && typeof puesto == 'object') {
      this.where.puestoIdSec = puesto.idsec;
      this.where._puestoNombre = puesto.nombre;
      this.changeDetector.detectChanges();
    }
  }

  public clearPuesto() {
    this.where.puestoIdSec = undefined;
    this.where._puestoNombre = '';
    this.changeDetector.detectChanges();
  }

  public selectCompetenciaEvent(competencia: Competencia) {
    if (competencia && typeof competencia == 'object') {
      this.where.competenciaIdSec = competencia.idsec;
      this.where._competenciaNombre = competencia.descripcion ?? '';
      this.changeDetector.detectChanges();
    }
  }

  public clearCompetencia() {
    this.where.competenciaIdSec = undefined;
    this.where._competenciaNombre = '';
    this.changeDetector.detectChanges();
  }

  public selectCapacitacionEvent(capacitacion: Capacitacion) {
    if (capacitacion && typeof capacitacion == 'object') {
      this.where.capacitacionIdSec = capacitacion.idsec;
      this.where._capacitacionNombre = capacitacion.descripcion;
      this.changeDetector.detectChanges();
    }
  }

  public clearCapacitacion() {
    this.where.capacitacionIdSec = undefined;
    this.where._capacitacionNombre = '';
    this.changeDetector.detectChanges();
  }

  public onCedulaKeyDown(event: KeyboardEvent) {
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

    let rawValue = this.where.cedula?.replace(/\D+/g, '') ?? '';

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

    this.where.cedula = formattedCedula;

    event.preventDefault();
  }
}
