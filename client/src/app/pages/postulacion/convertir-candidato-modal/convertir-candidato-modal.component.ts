import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { ToastManager } from '@blocks/toast/toast.manager';
import { Puesto } from '@models/puesto.model';
import {
  NgbActiveModal,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { StoreService } from '@services/store.service';
import { DatosContratacionType } from 'src/app/lib/types';

@Component({
  standalone: true,
  selector: 'app-convertir-candidato-modal',
  templateUrl: './convertir-candidato-modal.component.html',
  styleUrl: './convertir-candidato-modal.component.scss',
  imports: [
    NgIf,
    NgFor,
    ProgressBarComponent,
    FormsModule,
    NgbDatepickerModule,
  ],
})
export class ConvertirCandidatoModalComponent implements OnInit {
  protected modalTitle: string = 'Datos Contratación';
  @Input('candidatoId') CandidatoId: number = 0;
  @Input('datos`') datosContratacion: DatosContratacionType = {
    fechaIngreso: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    },
    departamento: '',
    salario: 0,
    puesto: new Puesto(),
  };

  constructor(
    protected activeModal: NgbActiveModal,
    protected storeService: StoreService,
    private toast: ToastManager
  ) {
    this.storeService.isLoading.set(false);
  }

  ngOnInit(): void {
    if (this.CandidatoId > 0) {
      this.modalTitle = `Datos Contratación (Candidato: ${this.CandidatoId})`;
    }
  }

  // Método para validar el salario y la fecha de ingreso
  private validate(): boolean {
    const warningMsg: string[] = [];
    const { salario, puesto, fechaIngreso } = this.datosContratacion;

    // Validación del salario
    if (!salario || salario <= 0) {
      warningMsg.push('El salario debe ser mayor a 0.');
    } else if (salario < (puesto?.nivelMinimoSalario || 0)) {
      warningMsg.push(
        `El salario no puede ser menor que ${puesto?.nivelMinimoSalario}`
      );
    } else if (salario > (puesto?.nivelMaximoSalario || Infinity)) {
      warningMsg.push(
        `El salario no puede ser mayor que ${puesto?.nivelMaximoSalario}`
      );
    }

    // Validación de la fecha de ingreso
    const currentDate = new Date();
    const inputDate = new Date(
      fechaIngreso.year,
      fechaIngreso.month - 1,
      fechaIngreso.day
    );

    if (inputDate < currentDate) {
      warningMsg.push('La fecha de ingreso no puede ser anterior a hoy.');
    }

    // Mostrar advertencias si existen
    if (warningMsg.length > 0) {
      warningMsg.forEach((msg: string) =>
        this.toast.quickShow(msg, 'warning', true)
      );
      return false;
    }

    return true;
  }
  public onGrabarClick(event: Event) {
    event.preventDefault();

    if (this.validate()) {
      this.activeModal.close(this.datosContratacion);
    }
  }
}
