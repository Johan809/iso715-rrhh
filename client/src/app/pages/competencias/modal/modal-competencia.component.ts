import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { ToastManager } from '@blocks/toast/toast.manager';
import { Competencia } from '@models/competencia.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompetenciaService } from '@services/competencia.service';
import { StoreService } from '@services/store.service';

@Component({
  selector: 'app-modal-competencia',
  standalone: true,
  templateUrl: './modal-competencia.component.html',
  styleUrl: './modal-competencia.component.scss',
  imports: [NgIf, ProgressBarComponent, FormsModule],
})
export class ModalCompetenciaComponent implements OnInit {
  @Input('idsec') IdSec: number = 0;
  protected modalTitle: string = 'Nueva Competencia';
  protected competencia: Competencia;

  constructor(
    protected activeModal: NgbActiveModal,
    protected storeService: StoreService,
    private competenciaService: CompetenciaService,
    private toast: ToastManager
  ) {
    this.competencia = new Competencia();
    this.storeService.isLoading.set(false);
  }

  ngOnInit(): void {
    if (this.IdSec > 0) {
      this.modalTitle = `Competencia (Id: ${this.IdSec})`;
      this.cargar();
    }
  }

  private async cargar(): Promise<void> {
    this.storeService.isLoading.set(true);
    this.competencia = await this.competenciaService.getOne(this.IdSec);
    this.storeService.isLoading.set(false);
  }

  private async grabar(): Promise<void> {
    this.storeService.isLoading.set(true);
    if (this.IdSec == 0) {
      await this.competenciaService.create(this.competencia);
    } else {
      await this.competenciaService.update(this.IdSec, this.competencia);
    }
    this.storeService.isLoading.set(false);
    this.toast.quickShow('Competencia grabada con éxito.', 'success');
    this.activeModal.close({ success: true });
  }

  public onGrabarClick(event: Event) {
    event.preventDefault();
    if (this.validate()) {
      this.grabar();
    }
  }

  private validate(): boolean {
    let isValid = true;

    if (!this.competencia.descripcion) {
      this.toast.quickShow('La descripción es requerida', 'warning');
      isValid = false;
    }

    return isValid;
  }
}
