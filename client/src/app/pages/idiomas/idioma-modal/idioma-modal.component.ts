import { NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { ToastManager } from '@blocks/toast/toast.manager';
import { Idioma } from '@models/idioma.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IdiomaService } from '@services/idioma.service';
import { StoreService } from '@services/store.service';

@Component({
  selector: 'app-idioma-modal',
  standalone: true,
  templateUrl: './idioma-modal.component.html',
  styleUrl: './idioma-modal.component.scss',
  imports: [NgIf, ProgressBarComponent, FormsModule],
})
export class IdiomaModalComponent implements OnInit {
  @Input('idsec') IdSec: number = 0;
  protected modalTitle: string = 'Nuevo Idioma';
  protected idioma: Idioma;

  constructor(
    protected activeModal: NgbActiveModal,
    protected storeService: StoreService,
    private idiomaService: IdiomaService,
    private toast: ToastManager
  ) {
    this.storeService.isLoading.set(false);
    this.idioma = new Idioma();
  }

  ngOnInit(): void {
    if (this.IdSec > 0) {
      this.modalTitle = `Idioma (Id: ${this.IdSec})`;
      this.cargar();
    }
  }

  private async cargar() {
    this.storeService.isLoading.set(true);
    this.idioma = await this.idiomaService.getOne(this.IdSec);
    this.storeService.isLoading.set(false);
  }

  private async grabar(): Promise<void> {
    this.storeService.isLoading.set(true);
    if (this.IdSec == 0) {
      await this.idiomaService.create(this.idioma);
    } else {
      await this.idiomaService.update(this.IdSec, this.idioma);
    }
    this.storeService.isLoading.set(false);
    this.toast.quickShow('Idioma grabado con éxito.', 'success');
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

    if (!this.idioma.nombre) {
      this.toast.quickShow('El Nombre es requerido', 'warning');
      isValid = false;
    }

    return isValid;
  }
}
