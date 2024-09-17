import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { ToastManager } from '@blocks/toast/toast.manager';
import { PageLayoutComponent } from '@layouts/page-layout/page-layout.component';
import { Candidato } from '@models/candidato.model';
import { Puesto } from '@models/puesto.model';
import { CandidatoService } from '@services/candidato.service';
import { PuestoService } from '@services/puesto.service';
import { StoreService } from '@services/store.service';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ESTADOS_DEFECTO } from 'src/app/lib/constants';
import { ObjectHelper } from 'src/app/lib/object.helper';
import { LabelValuePair } from 'src/app/lib/types';

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
  ],
})
export class PostulacionComponent implements OnInit {
  protected IdSec: number = 0;
  public candidato: Candidato;
  private PuestoIdSec: number = 0;
  protected puesto: Puesto;
  protected puestoList: Puesto[] = [];
  public EstadosList: LabelValuePair[] = [...Candidato.ESTADOS_LIST];

  @ViewChild('puestoAutoComplete')
  autoCompletePuesto: any;

  //to-do: aqui tenemos que cargar el puesto y las demas entidades,
  //tambien se debe tener en cuenta si es editando o creando,
  //manejar los botones de crear/actualizar, aprovar o rechazar,
  //y la vista que sea read-only

  constructor(
    protected storeService: StoreService,
    private toast: ToastManager,
    private candidatoService: CandidatoService,
    private puestoService: PuestoService,
    private route: ActivatedRoute
  ) {
    this.storeService.isLoading.set(false);
    this.candidato = new Candidato();
    this.puesto = new Puesto();
    console.log(this.candidato);
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const idsec = params.get('Id');
      const puestoIdSec = params.get('PuestoId');
      if (idsec) this.IdSec = Number.parseInt(idsec);
      if (puestoIdSec) this.PuestoIdSec = Number.parseInt(puestoIdSec);
    });
    if (this.IdSec) {
      this.cargarCandidato();
    }
    this.buscarPuestos();
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
          this.puesto =
            this.puestoList.find((p) => p.idsec == this.PuestoIdSec) ??
            new Puesto();
          this.candidato.puesto = this.puesto.idsec;
        }
      })
      .catch((err) => console.error('buscarPuestos', err));
  }

  public selectPuestoEvent(p: Puesto) {
    this.puesto = p;
    this.candidato.puesto = this.puesto.idsec;
  }

  public getPuestoNombre(p: Puesto) {
    return this.puesto.nombre;
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

  private cargarCandidato() {
    //to-do:cargar el candidato por idsec;
  }

  // Método para guardar la postulación
  public async onSubmit(): Promise<void> {
    try {
      this.storeService.isLoading.set(true);

      if (this.validate()) {
        await this.candidatoService.create(this.candidato);
        this.toast.quickShow('Postulación creada con éxito.', 'success', true);
      }
      this.storeService.isLoading.set(false);
    } catch (err) {
      this.toast.quickShow(
        'Ha ocurrido un error al crear la postulación.',
        'danger',
        true
      );
      this.storeService.isLoading.set(false);
    }
  }

  // Método de validación
  private validate(): boolean {
    let warningMsg: string[] = [];

    if (!this.candidato.nombre)
      warningMsg.push('El campo nombre es requerido.');
    if (!this.candidato.cedula)
      warningMsg.push('El campo cédula es requerido.');
    if (!this.candidato.departamento)
      warningMsg.push('El campo departamento es requerido.');
    if (!this.candidato.salarioAspira || this.candidato.salarioAspira <= 0) {
      warningMsg.push('El salario aspirado debe ser mayor a 0.');
    }

    if (warningMsg.length > 0) {
      warningMsg.forEach((msg: string) =>
        this.toast.quickShow(msg, 'warning', true)
      );
    }

    return warningMsg.length === 0;
  }
}
