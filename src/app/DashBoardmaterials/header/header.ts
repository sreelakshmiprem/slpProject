import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../api-service';
import { DecodeAuth } from '../../decode-auth';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  private router = inject(Router);
  private authService = inject(ApiService);
  private decodeAuth = inject(DecodeAuth);

  userName: string | null = null;

  constructor() {

    this.decodeAuth.user$.subscribe(user => {
      this.userName = user.userName;
    });
  }

  logout() {
    if (!this.userName) {

      this.clearAndRedirect();
      return;
    }


    this.authService.logout(this.userName).subscribe({
      next: () => this.clearAndRedirect(),
      error: () => this.clearAndRedirect()
    });
  }

  private clearAndRedirect() {

    document.cookie = 'access_token=; Max-Age=0; path=/;';
    this.router.navigate(['/login']);
  }
}