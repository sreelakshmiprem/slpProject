import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DecodeJwtService } from './decode-jwt-service';
export interface UserInfo {
  userId: string | null;
  userRole: string | null;
  userName: string | null,
  isExpiry: boolean;
}
@Injectable({
  providedIn: 'root'
})

export class DecodeAuth {
  private userSubject = new BehaviorSubject<UserInfo>({
    userId: null,
    userName: null,
    userRole: null,
    isExpiry: true
  });

  user$: Observable<UserInfo> = this.userSubject.asObservable();

  constructor(private jwtHelper: DecodeJwtService) { }

  setToken(token: string) {
    const userId = this.jwtHelper.getUserId(token);
    const userName = this.jwtHelper.getUsername(token);
    const userRole = this.jwtHelper.getUserRole(token);
    const isExpiry = this.jwtHelper.isTokenExpired(token);
    this.userSubject.next({ userId, userName, userRole, isExpiry });
  }

  clearToken() {
    this.userSubject.next({ userId: null, userName: null, userRole: null, isExpiry: true });
  }

  get currentUser(): UserInfo {
    return this.userSubject.value;
  }
}