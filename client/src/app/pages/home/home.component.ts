// Angular modules
import { CommonModule, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Components
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';
import { ToastManager } from '@blocks/toast/toast.manager';
import { RoleLevel } from '@enums/role-level.enum';
import { StorageHelper } from '@helpers/storage.helper';
import { PageLayoutComponent } from '@layouts/page-layout/page-layout.component';
import { Capacitacion } from '@models/capacitacion.model';
import { Empleado } from '@models/empleado.model';
import { Puesto } from '@models/puesto.model';
import { PuestoService } from '@services/puesto.service';
import { StoreService } from '@services/store.service';
import { ObjectHelper } from 'src/app/lib/object.helper';
import { UserInfo } from 'src/app/lib/types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    CommonModule,
    CurrencyPipe,
    PageLayoutComponent,
    ProgressBarComponent,
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
    private puestoService: PuestoService,
    private toast: ToastManager,
    private router: Router
  ) {
    this.storeService.isLoading.set(false);
    this.userInfo = StorageHelper.getUserInfo();
  }

  public ngOnInit(): void {
    if (this.userInfo?.role === RoleLevel.USER) {
      this.getPuestosActivos();
    } else if (
      (this.userInfo?.role ?? RoleLevel.NOT_LOGGED) >= RoleLevel.RRHH
    ) {
      this.loadDashboardData();
    }
  }

  private loadDashboardData() {}

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
    this.totalPages = Math.ceil(this.puestos.length / this.itemsPerPage);

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPuestos = this.puestos.slice(startIndex, endIndex);
  }

  public onPuestoClick(idsec: number) {
    const role = this.userInfo?.role ?? RoleLevel.NOT_LOGGED;
    if (role >= RoleLevel.USER) {
      this.router.navigate(['/postulacion'], {
        queryParams: { PuestoId: idsec },
      });
    } else {
      this.toast.quickShow(
        'Para poder visualizar este puesto, por favor inicia sesión.',
        'info',
        true
      );
      this.router.navigate(['/auth/login']);
    }
  }
}
