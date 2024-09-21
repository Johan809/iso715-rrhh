import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Empleado } from '@models/empleado.model';
import { StoreService } from '@services/store.service';
import { DateObject, LabelValuePair } from 'src/app/lib/types';
import { ToastManager } from '@blocks/toast/toast.manager';
import { EmpleadoService } from '@services/empleado.service';
import { PageLayoutComponent } from '@layouts/page-layout/page-layout.component';
import { FormConfirmComponent } from '@forms/form-confirm/form-confirm.component';
import { EmpleadoModalComponent } from './empleado-modal/empleado-modal.component';
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { ESTADOS_DEFECTO } from 'src/app/lib/constants';
import { ObjectHelper } from 'src/app/lib/object.helper';
import { Puesto } from '@models/puesto.model';
import { PuestoService } from '@services/puesto.service';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

@Component({
  standalone: true,
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrl: './empleados.component.scss',
  imports: [
    NgIf,
    NgFor,
    DatePipe,
    CurrencyPipe,
    FormsModule,
    PageLayoutComponent,
    ProgressBarComponent,
    NgbDatepickerModule,
    AutocompleteLibModule,
  ],
})
export class EmpleadosComponent implements OnInit {
  protected where = new Empleado.Where();
  protected empleados: Empleado[] = [];
  protected puestos: Puesto[] = [];
  protected EstadosList: LabelValuePair[] = [
    { label: 'Todos', value: '' },
    ...Empleado.ESTADOS_LIST,
  ];

  constructor(
    public storeService: StoreService,
    private empleadoService: EmpleadoService,
    private puestoService: PuestoService,
    private modalService: NgbModal,
    private toast: ToastManager,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.buscar();
    this.buscarPuestos();
  }

  private buscar() {
    this.storeService.isLoading.set(true);
    this.where.initDates();
    this.empleadoService
      .getAll(this.where)
      .then((data) => {
        this.empleados = [];
        data.forEach((emp) => {
          this.empleados.push(ObjectHelper.CopyObject(new Empleado(), emp));
        });
      })
      .catch((err) => {
        console.error('empleados', err);
        this.toast.quickShow('Error al buscar empleados', 'danger', true);
      })
      .finally(() => this.storeService.isLoading.set(false));
  }

  private buscarPuestos() {
    this.puestoService
      .getAll({ estado: ESTADOS_DEFECTO.ACTIVO })
      .then((data) => (this.puestos = data))
      .catch((err) => console.error('puesto', err));
  }

  public onBuscar() {
    this.buscar();
  }

  public selectPuestoEvent(puesto: Puesto) {
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

  public getPuestoNombre(puesto: Puesto | number | undefined): string {
    return (<Puesto>puesto).nombre;
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

  public getEstadoNombre(estado: string): string {
    switch (estado) {
      case ESTADOS_DEFECTO.ACTIVO:
        return ESTADOS_DEFECTO.ACTIVO_LABEL;
      case ESTADOS_DEFECTO.INACTIVO:
        return ESTADOS_DEFECTO.INACTIVO_LABEL;
      default:
        return '';
    }
  }

  public onCrear() {
    const modalRef = this.modalService.open(EmpleadoModalComponent, {
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

  public onReporte() {
    //to-do: terminar esto
  }

  public onEdit(id: number) {
    const modalRef = this.modalService.open(EmpleadoModalComponent, {
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

  public onCancelar(id: number) {
    const modalRef = this.modalService.open(FormConfirmComponent, {
      animation: true,
      centered: true,
      keyboard: true,
    });

    modalRef.componentInstance.message =
      '¿Está seguro que desea inactivar este empleado?';
    modalRef.result
      .then(async (action: boolean) => {
        try {
          if (action) {
            const empleado = this.empleados.find((x) => x.idsec === id);
            if (!empleado) return;
            empleado.estado = ESTADOS_DEFECTO.INACTIVO;

            await this.empleadoService.update(id, empleado);
            this.toast.quickShow(`Empleado Id: ${id} inactivado`, 'info');
          }
        } catch (err) {
          console.error(err);
          this.toast.quickShow('Error al inactivar empleado', 'danger', true);
        } finally {
          this.buscar();
        }
      })
      .catch(() => {});
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
