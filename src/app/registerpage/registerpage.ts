import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import { ApiService } from '../api-service';


declare let toastr: any;

@Component({
  selector: 'app-registerpage',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registerpage.html',
  styleUrl: './registerpage.scss'
})
export class Registerpage {
  registerForm!: FormGroup;
  loading = false;
  showPassword = false;
  showConfirmPassword = false;
  private honeypotTimer: any = null;
  private honeypotTriggered = false;

  constructor(private fb: FormBuilder, private authService: ApiService, private router: Router) { }

  ngOnInit() {
    toastr.options = {
      closeButton: true,
      progressBar: true,
      positionClass: "toast-top-right",
      timeOut: "3000"
    };


    this.registerForm = this.fb.group({
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
      confirmPassword: ['', Validators.required],
      role: ['User'],
      extraField: [''] // honeypot
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
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

  onRegister() {

    if (this.f['extraField'].value?.trim() !== '') {
      toastr.warning('Suspicious activity detected. Submission blocked.', 'Warning');
      return;
    }


    if (this.f['password'].value !== this.f['confirmPassword'].value) {
      toastr.error('Passwords do not match!', 'Error');
      return;
    }

    if (this.registerForm.invalid) {
      toastr.error('Please fix validation errors before submitting.', 'Validation Failed');
      return;
    }

    this.loading = true;

    const hashedPassword = CryptoJS.SHA256(this.f['password'].value).toString(CryptoJS.enc.Hex);

    const payload = {
      userName: this.f['userName'].value,
      password: hashedPassword,
      role: this.f['role'].value
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        toastr.success(res.message || 'Registration successful', 'Success');
        this.router.navigate(['/login']);
        this.loading = false;
      },
      error: (err) => {
        toastr.error(err.error?.message || 'Registration failed', 'Error');
        console.error('Registration error:', err);
        this.loading = false;
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
