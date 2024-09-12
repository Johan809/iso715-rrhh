import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { ToastManager } from '@blocks/toast/toast.manager';
import { Idioma } from '@models/idioma.model';
import { Puesto } from '@models/puesto.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IdiomaService } from '@services/idioma.service';
import { PuestoService } from '@services/puesto.service';
import { StoreService } from '@services/store.service';
import { LabelValuePair } from 'src/app/lib/types';

@Component({
  standalone: true,
  selector: 'app-puesto-modal',
  templateUrl: './puesto-modal.component.html',
  styleUrl: './puesto-modal.component.scss',
  imports: [NgIf, NgFor, ProgressBarComponent, FormsModule],
})
export class PuestoModalComponent implements OnInit {
  @Input('idsec') IdSec: number = 0;
  protected modalTitle: string = 'Nuevo Puesto';
  protected puesto: Puesto;
  public RiesgoList: LabelValuePair[] = [...Puesto.NivelRiesgoList];
  public EstadosList: LabelValuePair[] = [...Puesto.EstadosList];
  public IdiomasList: LabelValuePair[] = [];

  constructor(
    protected activeModal: NgbActiveModal,
    protected storeService: StoreService,
    private toast: ToastManager,
    private puestoService: PuestoService,
    private idiomaService: IdiomaService
  ) {
    this.storeService.isLoading.set(false);
    this.puesto = new Puesto();
    this.buscarIdiomas();
  }

  ngOnInit(): void {
    if (this.IdSec > 0) {
      this.modalTitle = `Puesto (Id: ${this.IdSec})`;
      this.cargar();
    }
  }

  private async buscarIdiomas() {
    let where = new Idioma.Where();
    where.estado = 'A';
    const idiomas = await this.idiomaService.getAll(where);
    if (idiomas) {
      this.IdiomasList = idiomas.map((i) => {
        return <LabelValuePair>{ label: i.nombre, value: i.idsec };
      });
    }
  }

  private async cargar() {
    this.storeService.isLoading.set(true);
    this.puesto = await this.puestoService.getOne(this.IdSec);
    if (typeof this.puesto.idioma == 'object') {
      this.puesto.idioma = this.puesto.idioma.idsec;
    }
    this.storeService.isLoading.set(false);
  }

  private async grabar(): Promise<void> {
    try {
      this.storeService.isLoading.set(true);

      if (this.IdSec == 0) {
        await this.puestoService.create(this.puesto);
      } else {
        await this.puestoService.update(this.IdSec, this.puesto);
      }

      this.storeService.isLoading.set(false);
      this.toast.quickShow('Puesto grabado con éxito.', 'success', true);
      this.activeModal.close({ success: true });
    } catch (err) {
      this.toast.quickShow('Ha ocurrido un error', 'danger', true);
    }
  }

  private validate(): boolean {
    let warningMsg = [];

    if (!this.puesto.nombre) warningMsg.push('El campo nombre es requerido');
    if (!this.puesto.descripcion)
      warningMsg.push('El campo descripción es requerido');
    if (!this.puesto.nivelRiesgo)
      warningMsg.push('El campo nivel de riesgo es requerido');
    if (
      this.puesto.nivelMinimoSalario == null ||
      this.puesto.nivelMinimoSalario === undefined
    )
      warningMsg.push('El campo salario mínimo es requerido');
    if (
      this.puesto.nivelMaximoSalario == null ||
      this.puesto.nivelMaximoSalario === undefined
    )
      warningMsg.push('El campo salario máximo es requerido');
    if (!this.puesto.idioma) warningMsg.push('El campo idioma es requerido');
    if (!this.puesto.estado) warningMsg.push('El campo estado es requerido');

    if (
      this.puesto.nivelMinimoSalario != null &&
      this.puesto.nivelMaximoSalario != null
    ) {
      if (this.puesto.nivelMinimoSalario > this.puesto.nivelMaximoSalario) {
        warningMsg.push(
          'El salario mínimo no puede ser mayor que el salario máximo'
        );
      }
    }

    if (warningMsg.length > 0) {
      warningMsg.forEach((msg: string) => {
        this.toast.quickShow(msg, 'warning', true);
      });
    }

    return warningMsg.length == 0;
  }

  public onGrabarClick(event: Event) {
    event.preventDefault();
    if (this.validate()) this.grabar();
  }
}
