// Angular modules
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';

// External modules
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownMenu } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

// Internal modules
import { environment } from '@env/environment';

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

  constructor(private router: Router) {}

  public ngOnInit(): void {}

  public async onClickLogout(): Promise<void> {
    // NOTE Redirect to login
    this.router.navigate(['/auth/login']);
  }
}
