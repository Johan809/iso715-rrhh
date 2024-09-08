// Angular modules
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleLevel } from '@enums/role-level.enum';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.routes').then((m) => m.routes),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'competencias',
    loadComponent: () =>
      import('./pages/competencias/list/competenciasList.component').then(
        (m) => m.CompetenciasListComponent
      ),
    canActivate: [AuthGuard],
    data: { requiredLevel: RoleLevel.RRHH },
  },
  {
    path: 'idiomas',
    loadComponent: () =>
      import('./pages/idiomas/idiomas.component').then(
        (m) => m.IdiomasComponent
      ),

    canActivate: [AuthGuard],
    data: { requiredLevel: RoleLevel.RRHH },
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
