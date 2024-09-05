import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '@env/environment';
import { AppService } from '@services/app.service';
import { StoreService } from '@services/store.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgIf,
    RouterLink,
    TranslateModule,
  ],
})
export class CreateAccountComponent {
  public appName: string = environment.appName;
  public formGroup!: FormGroup<{
    username: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
  }>;

  constructor(
    private router: Router,
    private storeService: StoreService,
    private appService: AppService
  ) {
    this.initFormGroup();
  }

  private initFormGroup(): void {
    this.formGroup = new FormGroup(
      {
        username: new FormControl<string>('', {
          validators: [Validators.required],
          nonNullable: true,
        }),
        email: new FormControl<string>('', {
          validators: [Validators.required, Validators.email],
          nonNullable: true,
        }),
        password: new FormControl<string>('', {
          validators: [Validators.required],
          nonNullable: true,
        }),
        confirmPassword: new FormControl<string>('', {
          validators: [Validators.required],
          nonNullable: true,
        }),
      },
      {
        validators: this.passwordsMatchValidator(),
      }
    );
  }

  private passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { match: true };
    };
  }

  public async onClickSubmit(): Promise<void> {
    if (this.formGroup.invalid) {
      return;
    }

    await this.registerAccount();
  }

  // Simulate account registration process
  private async registerAccount(): Promise<void> {
    this.storeService.isLoading.set(true);

    const username = this.formGroup.controls.username.getRawValue();
    const email = this.formGroup.controls.email.getRawValue();
    const password = this.formGroup.controls.password.getRawValue();

    const payload = {
      username,
      email,
      password,
    };
    const success = await this.appService.registerAccount(payload);
    this.storeService.isLoading.set(false);

    if (!success) return;

    this.router.navigate(['/home']); // Redirect to home after successful registration
  }
}
