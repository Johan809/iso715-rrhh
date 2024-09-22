import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import {
  NgbActiveModal,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';

import { Puesto } from '@models/puesto.model';
import { Empleado } from '@models/empleado.model';
import { DateObject, LabelValuePair } from 'src/app/lib/types';
import { StoreService } from '@services/store.service';
import { ESTADOS_DEFECTO } from 'src/app/lib/constants';
import { PuestoService } from '@services/puesto.service';
import { ToastManager } from '@blocks/toast/toast.manager';
import { EmpleadoService } from '@services/empleado.service';
import { CedulaHelper, ObjectHelper } from 'src/app/lib/helpers';
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';

@Component({
  standalone: true,
  selector: 'app-empleado-modal',
  templateUrl: './empleado-modal.component.html',
  styleUrls: ['./empleado-modal.component.scss'],
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    NgbDatepickerModule,
    ProgressBarComponent,
    AutocompleteLibModule,
  ],
})
export class EmpleadoModalComponent implements OnInit {
  @Input('idsec') IdSec: number = 0;
  protected modalTitle: string = 'Nuevo Empleado';
  protected empleado: Empleado = new Empleado();
  protected puesto: Puesto = new Puesto();
  protected puestoList: Puesto[] = [];
  public EstadosList: LabelValuePair[] = [...Empleado.ESTADOS_LIST];

  constructor(
    protected activeModal: NgbActiveModal,
    protected storeService: StoreService,
    private toast: ToastManager,
    private empleadoService: EmpleadoService,
    private puestoService: PuestoService
  ) {
    this.storeService.isLoading.set(false);
  }

  ngOnInit(): void {
    if (this.IdSec > 0) {
      this.modalTitle = `Empleado (Id: ${this.IdSec})`;
      this.cargar();
    }
    this.buscarPuestos();
  }

  private async buscarPuestos() {
    try {
      this.puestoList = await this.puestoService.getAll({
        estado: ESTADOS_DEFECTO.ACTIVO,
      });
    } catch (err) {
      console.error('Error al cargar puestos', err);
    }
  }

  private async cargar() {
    try {
      this.storeService.isLoading.set(true);
      const data = await this.empleadoService.getOne(this.IdSec);
      this.empleado = ObjectHelper.CopyObject(new Empleado(), data);
      this.empleado.fechaIngreso = this.convertDate(
        <string>this.empleado.fechaIngreso
      );
      this.puesto = ObjectHelper.CopyObject(
        new Puesto(),
        <Puesto>this.empleado.puesto
      );
      this.empleado.puesto = this.puesto.idsec;
    } catch (err) {
      this.toast.quickShow('Error al Cargar Empleado', 'danger', true);
    } finally {
      this.storeService.isLoading.set(false);
    }
  }

  private async grabar(): Promise<void> {
    try {
      this.storeService.isLoading.set(true);
      this.empleado.initDates();
      if (this.IdSec == 0) {
        await this.empleadoService.create(this.empleado);
      } else {
        await this.empleadoService.update(this.IdSec, this.empleado);
      }

      this.toast.quickShow('Empleado grabado con éxito.', 'success', true);
      this.activeModal.close({ success: true });
    } catch (err) {
      this.toast.quickShow('Ha ocurrido un error', 'danger', true);
    } finally {
      this.storeService.isLoading.set(false);
    }
  }

  public selectPuestoEvent(p: Puesto) {
    if (p && typeof p == 'object') {
      this.puesto = p;
      this.empleado.puesto = this.puesto.idsec;
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

  private convertDate(fecha: string): DateObject | string {
    if (fecha) {
      let str = fecha
        .split('T')[0]
        .split('-')
        .map((x) => Number.parseInt(x));
      return <DateObject>{
        year: str[0],
        month: str[1],
        day: str[2],
      };
    } else return '';
  }

  private validate(): boolean {
    let warningMsg: string[] = [];

    if (!this.empleado.cedula) {
      warningMsg.push('El campo cédula es requerido.');
    } else if (!CedulaHelper.Regex.test(this.empleado.cedula)) {
      warningMsg.push('La cédula no tiene un formato válido.');
    } else if (!CedulaHelper.ValidarCedula(this.empleado.cedula)) {
      warningMsg.push('La cédula ingresada no es válida.');
    }

    if (!this.empleado.nombre) warningMsg.push('El campo nombre es requerido.');
    if (!this.empleado.departamento)
      warningMsg.push('El campo departamento es requerido.');

    if (!this.empleado.salarioMensual || this.empleado.salarioMensual <= 0) {
      warningMsg.push('El salario aspirado debe ser mayor a 0.');
    } else if (this.puesto) {
      if (this.puesto.nivelMinimoSalario && this.puesto.nivelMaximoSalario) {
        if (
          this.empleado.salarioMensual < this.puesto.nivelMinimoSalario ||
          this.empleado.salarioMensual > this.puesto.nivelMaximoSalario
        ) {
          warningMsg.push(
            `El salario aspirado debe estar entre ${this.puesto.nivelMinimoSalario} y ${this.puesto.nivelMaximoSalario}.`
          );
        }
      }
    }

    if (warningMsg.length > 0) {
      warningMsg.forEach((msg) => this.toast.quickShow(msg, 'warning', true));
    }

    return warningMsg.length === 0;
  }

  public onGrabarClick(event: Event) {
    event.preventDefault();
    if (this.validate()) this.grabar();
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
    let rawValue = this.empleado.cedula?.replace(/\D+/g, '') ?? '';

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
    this.empleado.cedula = formattedCedula;

    // Evitar que se agregue el carácter real al input, ya que lo estamos manejando manualmente
    event.preventDefault();
  }
}
