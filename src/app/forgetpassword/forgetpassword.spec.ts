import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Forgetpassword } from './forgetpassword';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api-service';
import { of, throwError, Subject } from 'rxjs';
import { DecodeJwtService } from '../decode-jwt-service';
import * as CryptoJS from 'crypto-js';

describe('Forgetpassword', () => {
  let component: Forgetpassword;
  let fixture: ComponentFixture<Forgetpassword>;
  let apiServiceMock: any;
  let routerMock: any;
  let routeMock: any;
  let jwtHelperMock: any;

  beforeEach(async () => {
    (window as any).toastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
      warning: jasmine.createSpy('warning'),
      options: {}
    };

    apiServiceMock = { resetPassword: jasmine.createSpy('resetPassword') };
    routerMock = { navigate: jasmine.createSpy('navigate') };
    routeMock = { snapshot: { queryParamMap: { get: jasmine.createSpy('get').and.returnValue('fakeToken') } } };
    jwtHelperMock = {
      isTokenExpired: jasmine.createSpy('isTokenExpired').and.returnValue(false),
      getUsername: jasmine.createSpy('getUsername').and.returnValue('test@gmail.com')
    };

    await TestBed.configureTestingModule({
      imports: [Forgetpassword, CommonModule, ReactiveFormsModule], 
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: DecodeJwtService, useValue: jwtHelperMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Forgetpassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show error when passwords do not match', () => {
    component.resetForm.controls['password'].setValue('Password1!');
    component.resetForm.controls['confirmPassword'].setValue('Password2!');
    component.resetForm.controls['email'].setValue('test@gmail.com');

    component.onSubmit();

    expect((window as any).toastr.error).toHaveBeenCalledWith('Passwords do not match.', 'Error');
  });

  it('should call API and navigate on successful reset', fakeAsync(() => {
    const subject = new Subject<any>();
    apiServiceMock.resetPassword.and.returnValue(subject.asObservable());

    component.resetForm.controls['email'].setValue('test@gmail.com');
    component.resetForm.controls['password'].setValue('Password1!');
    component.resetForm.controls['confirmPassword'].setValue('Password1!');

    component.onSubmit();

    expect(component.isLoading).toBeTrue();
    expect(apiServiceMock.resetPassword).toHaveBeenCalledWith({
      userName: 'test@gmail.com',
      newPassword: CryptoJS.SHA256('Password1!').toString(CryptoJS.enc.Hex),
      newConfirmPassword: 'Password1!'
    });

    subject.next({});
    subject.complete();
    tick();
    fixture.detectChanges();

    expect(component.isLoading).toBeFalse();
    expect((window as any).toastr.success).toHaveBeenCalledWith('Password reset successfully.', 'Success');

    tick(3000);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should show error when API fails', () => {
    apiServiceMock.resetPassword.and.returnValue(throwError({ error: { Message: 'API Error' } }));

    component.resetForm.controls['email'].setValue('test@gmail.com');
    component.resetForm.controls['password'].setValue('Password1!');
    component.resetForm.controls['confirmPassword'].setValue('Password1!');

    component.onSubmit();

    expect(component.isLoading).toBeFalse();
    expect((window as any).toastr.error).toHaveBeenCalledWith('API Error', 'Error');
  });

  it('should toggle password visibility', () => {
    component.togglePasswordVisibility('new');
    expect(component.showPassword).toBeTrue();
    component.togglePasswordVisibility('confirm');
    expect(component.showConfirmPassword).toBeTrue();
  });

  it('should trigger honeypot warning on focus', fakeAsync(() => {
    component.onHoneypotFocus();
    expect((component as any).honeypotTriggered).toBeTrue();
    tick(5000);
    expect((window as any).toastr.warning).toHaveBeenCalledWith('Bot detected: trap field focused', 'Warning');
  }));

  it('should clear honeypot timer on blur', () => {
    component.onHoneypotFocus();
    component.onHoneypotBlur();
    expect((component as any).honeypotTriggered).toBeFalse();
    expect((component as any).honeypotTimer).toBeNull();
  });
});
