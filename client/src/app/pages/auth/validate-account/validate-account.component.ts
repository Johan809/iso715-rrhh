import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { environment } from '@env/environment';
import { AppService } from '@services/app.service';
import { StoreService } from '@services/store.service';

@Component({
  selector: 'app-validate-account',
  templateUrl: './validate-account.component.html',
  styleUrls: ['./validate-account.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgClass, NgIf, TranslateModule],
})
export class ValidateAccountComponent implements OnInit {
  public formGroup!: FormGroup<{
    password: FormControl<string>;
  }>;
  private tokenFromUrl: string = '';

  constructor(
    private router: Router,
    private storeService: StoreService,
    private activatedRoute: ActivatedRoute,
    private appService: AppService
  ) {
    this.initFormGroup();
  }

  public async ngOnInit(): Promise<void> {
    // NOTE Get token from URL
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.tokenFromUrl = params['token'];
      if (!environment.production)
        console.log(
          'ValidateAccountComponent : ngOnInit -> Token : ',
          this.tokenFromUrl
        );
    });
  }

  private initFormGroup(): void {
    this.formGroup = new FormGroup({
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
    if (!this.tokenFromUrl) return;

    await this.validateNewAccount();
  }

  private async validateNewAccount(): Promise<void> {
    this.storeService.isLoading.set(true);

    const password = this.formGroup.controls.password.getRawValue();
    const success = await this.appService.validateAccount(
      this.tokenFromUrl,
      password
    );

    this.storeService.isLoading.set(false);

    if (!success) return;

    this.router.navigate(['/home']);
  }
}
