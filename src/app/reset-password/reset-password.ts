import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api-service';

declare let toastr: any;

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword {
  forgotPasswordForm: FormGroup;
  isLoading = false;

  private honeypotTimer: any = null;
  private honeypotTriggered: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.minLength(10),
        Validators.maxLength(350),
        Validators.pattern('^[a-zA-Z0-9._%+-]+@(gmail\\.com|yahoo\\.com|outlook\\.com|.+\\.com|.+\\.in)$')
      ]),
      extraField: new FormControl('') // honeypot
    });
  }

  ngOnInit() {
    toastr.options = {
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-top-right',
      timeOut: 3000
    };
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  onHoneypotFocus() {
    this.honeypotTriggered = true;
    this.honeypotTimer = setTimeout(() => {
      if (this.honeypotTriggered) {
        toastr.warning('Bot detected: trap field focused', 'Warning');
      }
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
    if (this.forgotPasswordForm.invalid) return;

    if (this.f['extraField'].value.trim() !== '') {
      toastr.warning('Suspicious activity detected. Submission blocked.', 'Warning');
      return;
    }

    this.isLoading = true;
    const payload = { userName: this.f['email'].value };

    this.apiService.resetRequest(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        toastr.success('Reset link sent to your email.', 'Success');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        toastr.error(err?.error?.Message || 'Failed to send reset link.', 'Error');
      }
    });
  }
}