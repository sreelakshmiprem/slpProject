import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api-service';
import { DecodeAuth } from '../decode-auth';
import { DecodeJwtService } from '../decode-jwt-service';
import * as CryptoJS from 'crypto-js';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReCaptchaV3Service, RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha-2';

declare let toastr: any;

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RecaptchaV3Module,],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: '6LewtMQrAAAAACHNXAds6v6H9DGVs6ucyx7Rcpxe',
    }],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss'
})
export class LoginPage {

  loginForm!: FormGroup;
  isLoading = false;
  showPassword = false;
  private honeypotTimer: any = null;
  private honeypotTriggered = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private decodeJwt: DecodeJwtService,
    private decodeAuth: DecodeAuth,
    private route: Router,
    private recaptchaV3Service: ReCaptchaV3Service
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      userName: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.minLength(10),
          Validators.maxLength(350),
          Validators.pattern('^[a-zA-Z0-9._%+-]+@(gmail\\.com|yahoo\\.com|outlook\\.com|.+\\.com|.+\\.in)$')
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(64),
          Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,64}$')
        ]
      ],
      extraField: [''] // honeypot
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onHoneypotFocus() {
    this.honeypotTriggered = true;
    this.honeypotTimer = setTimeout(() => {
      if (this.honeypotTriggered) {
        toastr.warning('Bot detected: trap field focused', 'Warning');
      }
    }, 100);
  }

  onHoneypotBlur() {
    this.honeypotTriggered = false;
    if (this.honeypotTimer) {
      clearTimeout(this.honeypotTimer);
      this.honeypotTimer = null;
    }
  }

  executeRecaptcha(action: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.recaptchaV3Service.execute(action).subscribe({
        next: (token: string) => resolve(token),
        error: (err) => reject(err)
      });
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      toastr.error('Please fix validation errors before submitting.', 'Validation Failed');
      return;
    }

    if (this.f['extraField'].value?.trim() !== '' || this.honeypotTriggered) {
      toastr.warning('Suspicious activity detected. Submission blocked.', 'Warning');
      return;
    }

    this.isLoading = true;

    const hashedPassword = CryptoJS.SHA256(this.f['password'].value).toString(CryptoJS.enc.Hex);

    const payload = {
      userName: this.f['userName'].value,
      password: hashedPassword
    };

    this.apiService.login(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.token) {
          const username = this.decodeJwt.getUsername(res.token);
          this.decodeAuth.setToken(res.token);
          toastr.success(`Welcome ${username}`, 'Login Successful');
          this.route.navigate(['/Dashboard']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        toastr.error(err.error?.message || 'Login failed', 'Error');
        console.error('Login error:', err);
      }
    });
  }

  goToRegister() {
    this.route.navigate(['/register']);
  }

  goToForgotPassword() {
    this.route.navigate(['/requestResetpassword']);
  }
}