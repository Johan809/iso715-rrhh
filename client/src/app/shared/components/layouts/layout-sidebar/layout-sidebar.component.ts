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

@Component({
  selector: 'app-layout-sidebar',
  templateUrl: './layout-sidebar.component.html',
  styleUrl: './layout-sidebar.component.scss',
  standalone: true,
  imports: [
    RouterLink,
    NgbCollapse,
    RouterLinkActive,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    TranslateModule,
  ],
})
export class LayoutSidebarComponent implements OnInit {
  public appName: string = environment.appName;
  public isMenuCollapsed: boolean = true;
  public userInfo: UserInfo | null = null;
  public activeLink: string = 'home';

  constructor(
    private router: Router,
    private appService: AppService,
    private toastManager: ToastManager
  ) {}

  public ngOnInit(): void {
    this.userInfo = StorageHelper.getUserInfo();
    if (!this.userInfo) {
      this.toastManager.quickShow('¡No hay una sesión iniciada!', 'warning');
      this.router.navigate(['/auth/login']);
    }
  }

  public async onClickLogout(): Promise<void> {
    this.appService.logout();
    this.userInfo = null;
    this.router.navigate(['/auth/login']);
  }
}
