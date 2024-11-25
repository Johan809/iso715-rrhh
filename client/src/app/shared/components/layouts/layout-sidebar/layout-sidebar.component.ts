// Angular modules
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

// External modules
import {
  NgbCollapse,
  NgbDropdown,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

// Internal modules
import { environment } from '@env/environment';
import { StorageHelper } from '@helpers/storage.helper';
import { AppService } from '@services/app.service';
import { UserInfo } from 'src/app/lib/types';
import { ToastManager } from '@blocks/toast/toast.manager';
import { RoleLevel } from '@enums/role-level.enum';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-layout-sidebar',
  templateUrl: './layout-sidebar.component.html',
  styleUrl: './layout-sidebar.component.scss',
  imports: [NgIf, RouterLink, NgbCollapse, RouterLinkActive, TranslateModule],
})
export class LayoutSidebarComponent implements OnInit {
  public appName: string = environment.appName;
  public isMenuCollapsed: boolean = true;
  public userInfo: UserInfo | null = null;
  public activeLink: string = 'home';
  public isPropietariaPresentationMode = false;
  public ROLES = {
    NOT_LOGGED: RoleLevel.NOT_LOGGED,
    USER: RoleLevel.USER,
    RRHH: RoleLevel.RRHH,
    ADMIN: RoleLevel.ADMIN,
  };

  constructor(
    private router: Router,
    private appService: AppService,
    private toastManager: ToastManager
  ) {
    this.isPropietariaPresentationMode =
      appService.isPropietariaPresentationMode;
  }

  public ngOnInit(): void {
    this.userInfo = StorageHelper.getUserInfo();
    if (!this.userInfo) {
      this.toastManager.quickShow(
        '¡Inicie sesión para utilizar el sistema al máximo!',
        'info',
        true
      );
    }
  }

  public async onClickLogout(): Promise<void> {
    this.appService.logout();
    this.userInfo = null;
    this.toastManager.quickShow('Sesión cerrada correctamente.', 'info', true);
    this.router.navigate(['/auth/login']);
  }
}
