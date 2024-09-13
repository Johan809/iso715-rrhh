// Angular modules
import { CommonModule, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { StoreService } from '@services/store.service';

// Components
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { RoleLevel } from '@enums/role-level.enum';
import { StorageHelper } from '@helpers/storage.helper';
import { PageLayoutComponent } from '@layouts/page-layout/page-layout.component';
import { Puesto } from '@models/puesto.model';
import { PuestoService } from '@services/puesto.service';
import { UserInfo } from 'src/app/lib/types';
import { ObjectHelper } from 'src/app/lib/object.helper';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    PageLayoutComponent,
    NgIf,
    NgFor,
    ProgressBarComponent,
    CurrencyPipe,
    CommonModule,
  ],
})
export class HomeComponent implements OnInit {
  public puestos: Puesto[] = [];
  public paginatedPuestos: Puesto[] = [];
  public userInfo: UserInfo | null = null;
  public currentPage: number = 1;
  public itemsPerPage: number = 8;
  public totalPages: number = 0;
  public ROLES = {
    NOT_LOGGED: RoleLevel.NOT_LOGGED,
    USER: RoleLevel.USER,
    RRHH: RoleLevel.RRHH,
    ADMIN: RoleLevel.ADMIN,
  };

  constructor(
    public storeService: StoreService,
    private puestoService: PuestoService
  ) {
    this.storeService.isLoading.set(false);
    this.userInfo = StorageHelper.getUserInfo();
  }

  public ngOnInit(): void {
    this.getPuestosActivos();

    if (this.userInfo?.role === RoleLevel.USER) {
    }
  }

  public getNivelRiesgoLabel(nivelRiesgo: string | undefined): string {
    const nivel = Puesto.NivelRiesgoList.find((n) => n.value === nivelRiesgo);
    return nivel ? nivel.label : 'Desconocido';
  }

  public getCardBorderClass(nivelRiesgo: string | undefined): string {
    switch (nivelRiesgo) {
      case 'BAJO':
        return 'border-success';
      case 'MEDIO':
        return 'border-warning';
      case 'ALTO':
        return 'border-danger';
      default:
        return 'border-secondary';
    }
  }

  public changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    this.updatePaginatedPuestos();
  }

  public isActivePage(page: number): boolean {
    return this.currentPage === page;
  }

  private getPuestosActivos(): void {
    this.storeService.isLoading.set(true);
    this.puestoService
      .getAll({ estado: 'A' })
      .then((data) => {
        data.forEach((x) => {
          this.puestos.push(ObjectHelper.CopyObject(new Puesto(), x));
        });
        this.updatePaginatedPuestos();
      })
      .catch((error) =>
        console.error('Error al obtener los puestos activos:', error)
      )
      .finally(() => this.storeService.isLoading.set(false));
  }

  private updatePaginatedPuestos(): void {
    // Calcular el total de páginas
    this.totalPages = Math.ceil(this.puestos.length / this.itemsPerPage);

    // Filtrar los puestos según la página actual
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPuestos = this.puestos.slice(startIndex, endIndex);
  }
}
