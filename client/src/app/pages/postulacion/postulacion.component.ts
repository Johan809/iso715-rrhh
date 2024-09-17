import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { ToastManager } from '@blocks/toast/toast.manager';
import { StorageHelper } from '@helpers/storage.helper';
import { PageLayoutComponent } from '@layouts/page-layout/page-layout.component';
import { Candidato } from '@models/candidato.model';
import { Puesto } from '@models/puesto.model';
import { CandidatoService } from '@services/candidato.service';
import { CapacitacionService } from '@services/capacitacion.service';
import { CompetenciaService } from '@services/competencia.service';
import { ExperienciaLaboralService } from '@services/experienciaLaboral.service';
import { PuestoService } from '@services/puesto.service';
import { StoreService } from '@services/store.service';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import {
  IDropdownSettings,
  NgMultiSelectDropDownModule,
} from 'ng-multiselect-dropdown';
import { ESTADOS_DEFECTO } from 'src/app/lib/constants';
import { ObjectHelper } from 'src/app/lib/object.helper';
import { LabelValuePair, UserInfo } from 'src/app/lib/types';

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
  protected userInfo: UserInfo | null;
  public candidato: Candidato = new Candidato();
  private PuestoIdSec: number = 0;
  protected puesto: Puesto = new Puesto();
  protected puestoList: Puesto[] = [];
  public EstadosList: LabelValuePair[] = [...Candidato.ESTADOS_LIST];
  public competencias: LabelValuePair[] = [];
  public capacitaciones: LabelValuePair[] = [];
  public experiencias: LabelValuePair[] = [];
  protected dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'value',
    textField: 'label',
    selectAllText: 'Seleccionar todos',
    unSelectAllText: 'Deseleccionar todos',
    itemsShowLimit: 5,
    allowSearchFilter: true,
  };

  //to-do: aqui tenemos que cargar el puesto y las demas entidades,
  //tambien se debe tener en cuenta si es editando o creando,
  //manejar los botones de crear/actualizar, aprovar o rechazar,
  //y la vista que sea read-only

  constructor(
    protected storeService: StoreService,
    private toast: ToastManager,
    private candidatoService: CandidatoService,
    private puestoService: PuestoService,
    private route: ActivatedRoute,
    private competenciaService: CompetenciaService,
    private capacitacionService: CapacitacionService,
    private experienciaService: ExperienciaLaboralService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.storeService.isLoading.set(false);
    this.userInfo = StorageHelper.getUserInfo();
  }

  ngOnInit(): void {
    try {
      this.storeService.isLoading.set(true);
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
          this.puesto =
            this.puestoList.find((p) => p.idsec == this.PuestoIdSec) ??
            new Puesto();
          this.candidato.puesto = this.puesto.idsec;
          this.changeDetector.detectChanges();
        }
      })
      .catch((err) => console.error('buscarPuestos', err));
  }

  private async llenarDDL() {
    if (this.userInfo) {
      try {
        // Obtener las competencias
        const competenciasData = await this.competenciaService.getAll({
          estado: ESTADOS_DEFECTO.ACTIVO,
        });
        this.competencias = competenciasData.map((x) => ({
          label: x.descripcion ?? '',
          value: x.idsec,
        }));

        // Obtener las capacitaciones
        const capacitacionesData = await this.capacitacionService.getAll({
          user_name: this.userInfo.username,
        });
        this.capacitaciones = capacitacionesData.map((x) => ({
          label: x.descripcion,
          value: x.idsec,
        }));

        // Obtener las experiencias laborales
        const experienciasData = await this.experienciaService.getAll({
          user_name: this.userInfo.username,
        });
        this.experiencias = experienciasData.map((x) => ({
          label: x.puestoOcupado ?? '',
          value: x.idsec,
        }));

        // Forzar detección de cambios después de que todas las promesas hayan terminado
        //this.changeDetector.detectChanges();
      } catch (err) {
        console.error('Error al llenar datos: ', err);
      }
    }
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

  public onMultiSelect(item: any) {
    console.log('onMultiSelect', item);
  }
  public onMultiSelectAll(items: any[]) {
    console.log('onMultiSelectAll', items);
  }
}
