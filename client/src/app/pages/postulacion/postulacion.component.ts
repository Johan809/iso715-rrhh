import { Component } from '@angular/core';
import { PageLayoutComponent } from '../../shared/components/layouts/page-layout/page-layout.component';
import { ProgressBarComponent } from '../../shared/components/blocks/progress-bar/progress-bar.component';
import { NgIf } from '@angular/common';
import { StoreService } from '@services/store.service';

@Component({
  selector: 'app-postulacion',
  standalone: true,
  imports: [PageLayoutComponent, ProgressBarComponent, NgIf],
  templateUrl: './postulacion.component.html',
  styleUrl: './postulacion.component.scss',
})
export class PostulacionComponent {
  constructor(protected storeService: StoreService) {}
}
