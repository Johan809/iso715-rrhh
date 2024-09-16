import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  ],
})
export class PostulacionComponent implements OnInit {
  public candidato: Candidato;
  protected puesto: Puesto;

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
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const idsec = params.get('Id');
      const puestoIdSec = params.get('PuestoId');
      console.log('params', params, idsec, puestoIdSec);
    });
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
