import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})

export class DecodeJwtService {
  private jwtHelper = new JwtHelperService();

  decodeToken(token: string): any {
    try {
      return this.jwtHelper.decodeToken(token);
    } catch {
      return null;
    }
  }

  getUsername(token: string): string | null {
    const decoded = this.decodeToken(token);
    return decoded?.username || decoded?.unique_name || decoded?.sub || null;
  }

  getUserId(token: string): string | null {
    const decoded = this.decodeToken(token);
    return decoded?.userId || decoded?.nameid || null;
  }

  getUserRole(token: string): string | null {
    const decoded = this.decodeToken(token);
    return decoded?.role || decoded?.roles || null;
  }

  getTokenExpiry(token: string): Date | null {
    const decoded = this.decodeToken(token);
    if (decoded?.exp) {
      return new Date(decoded.exp * 1000);
    }
    return null;
  }

  isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }
}
