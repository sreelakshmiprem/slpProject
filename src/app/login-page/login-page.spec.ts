import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginPage } from './login-page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api-service';
import { DecodeJwtService } from '../decode-jwt-service';
import { DecodeAuth } from '../decode-auth';
import { of, throwError } from 'rxjs';
import { ReCaptchaV3Service, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha-2';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let apiServiceMock: any;
  let routerMock: any;
  let jwtMock: any;
  let authMock: any;
  let recaptchaMock: any;

  beforeEach(async () => {
    (window as any).toastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
      warning: jasmine.createSpy('warning'),
    };

    apiServiceMock = { login: jasmine.createSpy('login') };
    routerMock = { navigate: jasmine.createSpy('navigate') };
    jwtMock = { getUsername: jasmine.createSpy('getUsername').and.returnValue('testuser') };
    authMock = { setToken: jasmine.createSpy('setToken') };
    recaptchaMock = { execute: jasmine.createSpy('execute').and.returnValue(of('fake-token')) };

    await TestBed.configureTestingModule({
      imports: [LoginPage, ReactiveFormsModule, FormsModule],  
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: DecodeJwtService, useValue: jwtMock },
        { provide: DecodeAuth, useValue: authMock },
        { provide: ReCaptchaV3Service, useValue: recaptchaMock },
        { provide: RECAPTCHA_V3_SITE_KEY, useValue: 'fake-site-key' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalse();
    component.togglePassword();
    expect(component.showPassword).toBeTrue();
  });

  it('should show validation error if form invalid', () => {
    component.loginForm.controls['userName'].setValue('');
    component.loginForm.controls['password'].setValue('');
    component.onLogin();
    expect((window as any).toastr.error)
      .toHaveBeenCalledWith('Please fix validation errors before submitting.', 'Validation Failed');
  });

  it('should block submission if honeypot triggered', fakeAsync(() => {
    // Simulate honeypot focus
    component.onHoneypotFocus();
  
    // Set the extraField value to simulate bot input
    component.loginForm.controls['extraField'].setValue('bot');
  
    // Advance time for setTimeout
    tick(150);
  
    component.onLogin();
  
    expect((window as any).toastr.warning)
      .toHaveBeenCalledWith('Bot detected: trap field focused', 'Warning');
  
    expect(apiServiceMock.login).not.toHaveBeenCalled();
  
    // Clean up
    component.onHoneypotBlur();
    tick();
  }));
  

  it('should call API and navigate on successful login', fakeAsync(() => {
    component.loginForm.controls['userName'].setValue('test@gmail.com');
    component.loginForm.controls['password'].setValue('Password1!');

    apiServiceMock.login.and.returnValue(of({ token: 'fake-jwt-token' }));

    component.onLogin();
    tick();

    expect(component.isLoading).toBeFalse();
    expect(jwtMock.getUsername).toHaveBeenCalledWith('fake-jwt-token');
    expect(authMock.setToken).toHaveBeenCalledWith('fake-jwt-token');
    expect((window as any).toastr.success)
      .toHaveBeenCalledWith('Welcome testuser', 'Login Successful');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/Dashboard']);
  }));

  it('should show error if API fails', fakeAsync(() => {
    component.loginForm.controls['userName'].setValue('test@gmail.com');
    component.loginForm.controls['password'].setValue('Password1!');

    apiServiceMock.login.and.returnValue(throwError({ error: { message: 'Invalid credentials' } }));

    component.onLogin();
    tick();

    expect(component.isLoading).toBeFalse();
    expect((window as any).toastr.error).toHaveBeenCalledWith('Invalid credentials', 'Error');
  }));
});
