import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  IDropdownSettings,
  NgMultiSelectDropDownModule,
} from 'ng-multiselect-dropdown';

import { Puesto } from '@models/puesto.model';
import { Candidato } from '@models/candidato.model';
import { StoreService } from '@services/store.service';
import { ESTADOS_DEFECTO } from 'src/app/lib/constants';
import { StorageHelper } from '@helpers/storage.helper';
import { CedulaHelper, ObjectHelper } from 'src/app/lib/helpers';
import { PuestoService } from '@services/puesto.service';
import { ToastManager } from '@blocks/toast/toast.manager';
import {
  DateObject,
  DatosContratacionType,
  LabelValuePair,
  UserInfo,
} from 'src/app/lib/types';
import { CandidatoService } from '@services/candidato.service';
import { CompetenciaService } from '@services/competencia.service';
import { CapacitacionService } from '@services/capacitacion.service';
import { ExperienciaLaboralService } from '@services/experienciaLaboral.service';
import { PageLayoutComponent } from '@layouts/page-layout/page-layout.component';
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { FormConfirmComponent } from '@forms/form-confirm/form-confirm.component';
import { ConvertirCandidatoModalComponent } from './convertir-candidato-modal/convertir-candidato-modal.component';
import { EmpleadoService } from '@services/empleado.service';

@Component({
  standalone: true,
  selector: 'app-postulacion',
  templateUrl: './postulacion.component.html',
  styleUrl: './postulacion.component.scss',
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    ProgressBarComponent,
    PageLayoutComponent,
    AutocompleteLibModule,
    NgMultiSelectDropDownModule,
    CommonModule,
  ],
})
export class PostulacionComponent implements OnInit {
  protected IdSec: number = 0;
  protected EsModoVer: boolean = false;
  private userInfo: UserInfo | null;
  public candidato: Candidato = new Candidato();
  protected PuestoIdSec: number = 0;
  protected puesto: Puesto = new Puesto();
  protected puestoList: Puesto[] = [];
  public competencias: LabelValuePair[] = [];
  public capacitaciones: LabelValuePair[] = [];
  public experiencias: LabelValuePair[] = [];

  public readonly EstadosList: LabelValuePair[] = [...Candidato.ESTADOS_LIST];
  protected readonly dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'value',
    textField: 'label',
    selectAllText: 'Seleccionar todos',
    unSelectAllText: 'Deseleccionar todos',
    itemsShowLimit: 5,
    allowSearchFilter: true,
  };
  protected readonly ENTIDAD_IDENTIFICADOR = {
    COMPETENCIA: 'C',
    CAPACITACION: 'A',
    EXPERIENCIA: 'E',
  };

  constructor(
    private toast: ToastManager,
    protected storeService: StoreService,
    private puestoService: PuestoService,
    private empleadoService: EmpleadoService,
    private candidatoService: CandidatoService,
    private competenciaService: CompetenciaService,
    private capacitacionService: CapacitacionService,
    private experienciaService: ExperienciaLaboralService,
    private changeDetector: ChangeDetectorRef,
    private activeRoute: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.storeService.isLoading.set(false);
    this.userInfo = StorageHelper.getUserInfo();
  }

  ngOnInit(): void {
    try {
      this.storeService.isLoading.set(true);
      this.activeRoute.queryParamMap.subscribe((params) => {
        const idsec = params.get('Id');
        const puestoIdSec = params.get('PuestoId');
        if (idsec) this.IdSec = Number.parseInt(idsec);
        if (puestoIdSec) this.PuestoIdSec = Number.parseInt(puestoIdSec);
      });
      if (this.IdSec) {
        this.cargarCandidato();
      }
      this.buscarPuestos();
      this.llenarDDL();
    } finally {
      this.storeService.isLoading.set(false);
    }
  }

  private buscarPuestos() {
    this.puestoList = [];
    this.puestoService
      .getAll({ estado: ESTADOS_DEFECTO.ACTIVO })
      .then((res) => {
        res.map((x) => {
          const data = ObjectHelper.CopyObject(new Puesto(), x);
          this.puestoList.push(data);
        });
        if (this.PuestoIdSec) {
          let temp = this.puestoList.find((p) => p.idsec == this.PuestoIdSec);
          if (temp) {
            this.puesto = temp;
            this.candidato.puesto = this.puesto.idsec;
            this.changeDetector.detectChanges();
          }
        }
      })
      .catch((err) => console.error('buscarPuestos', err));
  }

  private async llenarDDL() {
    if (this.userInfo) {
      try {
        const competenciasData = await this.competenciaService.getAll({
          estado: ESTADOS_DEFECTO.ACTIVO,
        });
        this.competencias = competenciasData.map((x) => ({
          label: x.descripcion ?? '',
          value: x.idsec,
        }));

        const capacitacionesData = await this.capacitacionService.getAll({
          user_name: this.userInfo.username,
        });
        this.capacitaciones = capacitacionesData.map((x) => ({
          label: x.descripcion,
          value: x.idsec,
        }));

        const experienciasData = await this.experienciaService.getAll({
          user_name: this.userInfo.username,
        });
        this.experiencias = experienciasData.map((x) => ({
          label: x.puestoOcupado ?? '',
          value: x.idsec,
        }));
      } catch (err) {
        console.error('Error al llenar datos: ', err);
      }
    }
  }

  public selectPuestoEvent(p: Puesto) {
    if (p && typeof p == 'object') {
      this.puesto = p;
      this.candidato.puesto = this.puesto.idsec;
    }
  }

  public getPlaceholderSalario(): string {
    const salarioMinimo = this.puesto ? this.puesto.nivelMinimoSalario ?? 0 : 0;
    const salarioMaximo = this.puesto ? this.puesto.nivelMaximoSalario ?? 0 : 0;
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'DOP',
    });

    return this.puesto
      ? `Entre ${formatter.format(salarioMinimo)} y ${formatter.format(
          salarioMaximo
        )}`
      : 'Ingrese el salario aspirado';
  }

  public onCedulaKeyDown(event: KeyboardEvent) {
    // Permitir las teclas de control (borrar, retroceso, flechas)
    const controlKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
    ];
    if (controlKeys.includes(event.key)) {
      return; // Permitir estas teclas
    }

    // Permitir solo números
    const isNumber = /^[0-9]$/.test(event.key);
    if (!isNumber) {
      event.preventDefault(); // Evita que caracteres no numéricos se ingresen
      return;
    }

    // Eliminar caracteres no numéricos del valor actual
    let rawValue = this.candidato.cedula?.replace(/\D+/g, '') ?? '';

    // Agregar el nuevo número al final del valor actual
    rawValue += event.key;

    // Limitar a 11 caracteres (sin guiones)
    if (rawValue.length > 11) {
      event.preventDefault(); // Evita que se ingresen más de 11 números
      return;
    }

    // Formatear la cédula (000-0000000-0)
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

    // Actualizar el valor en el input
    this.candidato.cedula = formattedCedula;

    // Evitar que se agregue el carácter real al input, ya que lo estamos manejando manualmente
    event.preventDefault();
  }

  private async cargarCandidato() {
    try {
      this.storeService.isLoading.set(true);
      const res = await this.candidatoService.getOne(this.IdSec);
      this.candidato = ObjectHelper.CopyObject(new Candidato(), res);
      this.candidato.fillCompetenciaList();
      this.candidato.fillExperienciaList();
      this.candidato.fillCapacitacionList();
      this.puesto = ObjectHelper.CopyObject(
        new Puesto(),
        <Puesto>this.candidato.puesto
      );
      this.candidato.puesto = this.puesto.idsec;
      this.EsModoVer = this.candidato.user_name !== this.userInfo?.username;
    } catch (err) {
      this.toast.quickShow('Error al cargar Candidato', 'danger', true);
    } finally {
      this.storeService.isLoading.set(false);
    }
  }

  // Método para guardar la postulación
  public async onSubmit(): Promise<void> {
    try {
      this.storeService.isLoading.set(true);
      if (!this.validate()) return;
      this.candidato.assignCompetencias();
      this.candidato.assignExperiencias();
      this.candidato.assignCapacitaciones();

      if (this.IdSec === 0) {
        this.candidato.user_name = this.userInfo?.username;
        await this.candidatoService.create(this.candidato);
        this.toast.quickShow(
          'Postulación creada con éxito. Redirigiendo...',
          'success',
          true
        );
        setTimeout(() => {
          this.router.navigate(['/candidatos']);
        }, 3000);
      } else {
        await this.candidatoService.update(this.IdSec, this.candidato);
        this.toast.quickShow(
          'Postulación actualizada con éxito. Redirigiendo...',
          'success',
          true
        );
        setTimeout(() => {
          this.router.navigate(['/candidatos']);
        }, 3000);
      }
    } catch (err) {
      this.toast.quickShow(
        'Ha ocurrido un error al crear la postulación.',
        'danger',
        true
      );
      this.storeService.isLoading.set(false);
    } finally {
      this.storeService.isLoading.set(false);
    }
  }

  private validate(): boolean {
    let warningMsg: string[] = [];

    if (!this.candidato.nombre) {
      warningMsg.push('El campo nombre es requerido.');
    }

    if (!this.candidato.cedula) {
      warningMsg.push('El campo cédula es requerido.');
    } else if (!CedulaHelper.Regex.test(this.candidato.cedula)) {
      warningMsg.push('La cédula no tiene un formato válido.');
    } else if (!CedulaHelper.ValidarCedula(this.candidato.cedula)) {
      warningMsg.push('La cédula ingresada no es válida.');
    }

    if (!this.candidato.puesto) {
      warningMsg.push('El campo puesto es requerido.');
    } else if (!this.puesto || !this.puesto.idsec) {
      warningMsg.push('El puesto seleccionado no es válido.');
    }

    if (!this.candidato.departamento) {
      warningMsg.push('El campo departamento es requerido.');
    }

    if (!this.candidato.salarioAspira || this.candidato.salarioAspira <= 0) {
      warningMsg.push('El salario aspirado debe ser mayor a 0.');
    } else if (this.puesto) {
      if (this.puesto.nivelMinimoSalario && this.puesto.nivelMaximoSalario) {
        if (
          this.candidato.salarioAspira < this.puesto.nivelMinimoSalario ||
          this.candidato.salarioAspira > this.puesto.nivelMaximoSalario
        ) {
          warningMsg.push(
            `El salario aspirado debe estar entre ${this.puesto.nivelMinimoSalario} y ${this.puesto.nivelMaximoSalario}.`
          );
        }
      }
    }

    if (warningMsg.length > 0) {
      warningMsg.forEach((msg: string) => {
        this.toast.quickShow(msg, 'warning', true);
      });
    }

    return warningMsg.length === 0;
  }

  protected onCancelar() {
    const modalRef = this.modalService.open(FormConfirmComponent, {
      animation: true,
      centered: true,
      keyboard: true,
    });

    modalRef.componentInstance.message =
      '¿Está seguro que desea cancelar esta postulación?';
    modalRef.result
      .then(async (action: boolean) => {
        try {
          if (action) {
            this.candidato.estado = Candidato.ESTADOS.INACTIVO;
            this.candidato.assignCompetencias();
            this.candidato.assignExperiencias();
            this.candidato.assignCapacitaciones();
            await this.candidatoService.update(this.IdSec, this.candidato);
            this.toast.quickShow(
              `Postulación Id: ${this.IdSec} cancelada`,
              'info'
            );
          }
        } catch (er) {
          console.error(er);
          this.toast.quickShow('error al cancelar Postulación', 'danger', true);
        }
      })
      .catch(() => {});
  }

  protected async onRevisionAccion(accion: boolean) {
    if (accion) {
      this.contratarCandidato();
    } else {
      this.rechazarCandidato();
    }
  }

  private contratarCandidato() {
    const modalRef = this.modalService.open(ConvertirCandidatoModalComponent, {
      animation: true,
      centered: true,
      keyboard: true,
    });

    const fechaHoy = new Date();
    const objFechaHoy: DateObject = {
      year: fechaHoy.getFullYear(),
      month: fechaHoy.getMonth() + 1,
      day: fechaHoy.getDate(),
    };
    modalRef.componentInstance.CandidatoId = this.candidato.idsec;
    modalRef.componentInstance.datosContratacion = {
      departamento: this.candidato.departamento,
      salario: this.candidato.salarioAspira,
      fechaIngreso: objFechaHoy,
      puesto: this.puesto,
    };
    modalRef.result
      .then(async (res: DatosContratacionType) => {
        try {
          this.storeService.isLoading.set(true);
          const response = await this.empleadoService.createFromCandidato(
            this.IdSec,
            res
          );
          if (response) {
            this.toast.quickShow(
              `Candidato contratado con éxito. Empleado Id: ${response.idsec}`,
              'success',
              true
            );
            setTimeout(() => {
              this.router.navigate(['/empleados']);
            }, 3000);
          }
        } catch (err) {
          console.error(err);
          this.toast.quickShow(
            'Error al convertir Candidato en Empleado',
            'danger',
            true
          );
        } finally {
          this.storeService.isLoading.set(false);
        }
      })
      .catch(() => {});
  }

  private rechazarCandidato() {
    const modalRef = this.modalService.open(FormConfirmComponent, {
      animation: true,
      centered: true,
      keyboard: true,
    });

    modalRef.componentInstance.message =
      '¿Está seguro que desea rechazar a este candidato?';
    modalRef.result
      .then(async (val: boolean) => {
        try {
          if (val) {
            this.candidato.estado = Candidato.ESTADOS.RECHAZADO;
            this.candidato.assignCompetencias();
            this.candidato.assignExperiencias();
            this.candidato.assignCapacitaciones();
            await this.candidatoService.update(this.IdSec, this.candidato);
            this.toast.quickShow(
              `Candidato Id: ${this.IdSec} rechazado`,
              'info'
            );
            setTimeout(() => {
              this.router.navigate(['/candidatos']);
            }, 3000);
          }
        } catch (er) {
          console.error(er);
          this.toast.quickShow('error al rechazar Candidato', 'danger', true);
        }
      })
      .catch(() => {});
  }

  public onMultiSelect(e: any, entidad: string) {
    const item = <LabelValuePair>e;
    if (!item || !item.value) {
      return;
    }

    switch (entidad) {
      case this.ENTIDAD_IDENTIFICADOR.COMPETENCIA:
        if (!this.candidato.competencias) this.candidato.competencias = [];
        (<number[]>this.candidato.competencias).push(<number>item.value);
        break;
      case this.ENTIDAD_IDENTIFICADOR.CAPACITACION:
        if (!this.candidato.capacitaciones) this.candidato.capacitaciones = [];
        (<number[]>this.candidato.capacitaciones).push(<number>item.value);
        break;
      case this.ENTIDAD_IDENTIFICADOR.EXPERIENCIA:
        if (!this.candidato.experienciaLaboral)
          this.candidato.experienciaLaboral = [];
        (<number[]>this.candidato.experienciaLaboral).push(<number>item.value);
        break;
    }
  }

  public onMultiDeSelect(e: any, entidad: string) {
    const item = <LabelValuePair>e;
    if (!item || !item.value) {
      return;
    }

    switch (entidad) {
      case this.ENTIDAD_IDENTIFICADOR.COMPETENCIA:
        if (this.candidato.competencias) {
          this.candidato.competencias = (<number[]>(
            this.candidato.competencias
          )).filter((id: number) => id !== <number>item.value);
        }
        break;
      case this.ENTIDAD_IDENTIFICADOR.CAPACITACION:
        if (this.candidato.capacitaciones) {
          this.candidato.capacitaciones = (<number[]>(
            this.candidato.capacitaciones
          )).filter((id: number) => id !== item.value);
        }
        break;
      case this.ENTIDAD_IDENTIFICADOR.EXPERIENCIA:
        if (this.candidato.experienciaLaboral) {
          this.candidato.experienciaLaboral = (<number[]>(
            this.candidato.experienciaLaboral
          )).filter((id: number) => id !== item.value);
        }
        break;
    }
  }

  public onMultiSelectAll(e: any[], entidad: string) {
    const items = <LabelValuePair[]>e;

    switch (entidad) {
      case this.ENTIDAD_IDENTIFICADOR.COMPETENCIA:
        if (!this.candidato.competencias) {
          this.candidato.competencias = [];
        }
        this.candidato.competencias = items.map((item) => <number>item.value);
        break;

      case this.ENTIDAD_IDENTIFICADOR.CAPACITACION:
        if (!this.candidato.capacitaciones) {
          this.candidato.capacitaciones = [];
        }
        this.candidato.capacitaciones = items.map((item) => <number>item.value);
        break;

      case this.ENTIDAD_IDENTIFICADOR.EXPERIENCIA:
        if (!this.candidato.experienciaLaboral) {
          this.candidato.experienciaLaboral = [];
        }
        this.candidato.experienciaLaboral = items.map(
          (item) => <number>item.value
        );
        break;
    }
  }

  public onMultiDeSelectAll(entidad: string) {
    switch (entidad) {
      case this.ENTIDAD_IDENTIFICADOR.COMPETENCIA:
        this.candidato.competencias = [];
        break;
      case this.ENTIDAD_IDENTIFICADOR.CAPACITACION:
        this.candidato.capacitaciones = [];
        break;
      case this.ENTIDAD_IDENTIFICADOR.EXPERIENCIA:
        this.candidato.experienciaLaboral = [];
        break;
    }
  }
}
