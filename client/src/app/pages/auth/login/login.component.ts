// Angular modules
import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { environment } from '@env/environment';
import { AppService } from '@services/app.service';
import { StoreService } from '@services/store.service';
import { ToastManager } from '@blocks/toast/toast.manager';
import { ProgressBarComponent } from '@blocks/progress-bar/progress-bar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgIf,
    RouterLink,
    TranslateModule,
    ProgressBarComponent,
  ],
})
export class LoginComponent {
  public appName: string = environment.appName;
  public formGroup!: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }>;

  constructor(
    private router: Router,
    public storeService: StoreService,
    private appService: AppService,
    private toastManager: ToastManager
  ) {
    this.initFormGroup();
    this.storeService.isLoading.set(false);
  }

  private initFormGroup(): void {
    this.formGroup = new FormGroup({
      email: new FormControl<string>(
        {
          value: '',
          disabled: false,
        },
        {
          validators: [Validators.required, Validators.email],
          nonNullable: true,
        }
      ),
      password: new FormControl<string>(
        {
          value: '',
          disabled: false,
        },
        { validators: [Validators.required], nonNullable: true }
      ),
    });
  }

  public async onClickSubmit(): Promise<void> {
    await this.authenticate();
  }

  private async authenticate(): Promise<void> {
    this.storeService.isLoading.set(true);

    const email = this.formGroup.controls.email.getRawValue();
    const password = this.formGroup.controls.password.getRawValue();
    const success = await this.appService.authenticate(email, password);

    this.storeService.isLoading.set(false);

    if (!success) return;

    this.toastManager.quickShow('Inicio de sesión exitoso.', 'success', true);
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 2000);
  }
}
