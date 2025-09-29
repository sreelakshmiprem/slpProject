import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api-service';
import { DecodeJwtService } from '../decode-jwt-service';
import * as CryptoJS from 'crypto-js';

declare let toastr: any;
@Component({
  selector: 'app-forgetpassword',
  imports: [CommonModule, FormsModule,  ReactiveFormsModule],
  templateUrl: './forgetpassword.html',
  styleUrl: './forgetpassword.scss'
})
export class Forgetpassword {
  resetForm: FormGroup;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  private honeypotTimer: any = null;
  private honeypotTriggered: boolean = false;

  constructor(
    private apiService: ApiService,
    private jwtHelper: DecodeJwtService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = new FormGroup({
      email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,64}$')
      ]),
      confirmPassword: new FormControl('', Validators.required),
      extraField: new FormControl('') // honeypot
    });
  }

  get f() {
    return this.resetForm.controls;
  }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const username = this.jwtHelper.getUsername(token);
      if (username) this.resetForm.get('email')?.setValue(username);  
    } else {
      toastr.error('Reset link is invalid or expired.', 'Error');
    }

    toastr.options = {
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-top-right',
      timeOut: 3000
    };
  }

  togglePasswordVisibility(field: 'new' | 'confirm') {
    if (field === 'new') this.showPassword = !this.showPassword;
    else this.showConfirmPassword = !this.showConfirmPassword;
  }

  onHoneypotFocus() {
    this.honeypotTriggered = true;
    this.honeypotTimer = setTimeout(() => {
      if (this.honeypotTriggered) toastr.warning('Bot detected: trap field focused', 'Warning');
    }, 5000);
  }

  onHoneypotBlur() {
    this.honeypotTriggered = false;
    if (this.honeypotTimer) {
      clearTimeout(this.honeypotTimer);
      this.honeypotTimer = null;
    }
  }

  onSubmit() {
    if (this.resetForm.invalid) return;

    if (this.f['extraField'].value.trim() !== '') {
      toastr.warning('Suspicious activity detected. Submission blocked.', 'Warning');
      return;
    }

    if (this.f['password'].value !== this.f['confirmPassword'].value) {
      toastr.error('Passwords do not match.', 'Error');
      return;
    }

    const hashedPassword = CryptoJS.SHA256(this.f['password'].value).toString(CryptoJS.enc.Hex);

    this.isLoading = true;
    this.apiService.resetPassword({
      userName: this.f['email'].value,
      newPassword: hashedPassword,
      newConfirmPassword: this.f['password'].value
    }).subscribe({
      next: () => {
        this.isLoading = false;
        toastr.success('Password reset successfully.', 'Success');
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.isLoading = false;
        toastr.error(err?.error?.Message || 'Failed to reset password.', 'Error');
      }
    });
  }
}