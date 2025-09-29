import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Registerpage } from './registerpage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api-service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { of, throwError } from 'rxjs';

describe('Registerpage', () => {
  let component: Registerpage;
  let fixture: ComponentFixture<Registerpage>;
  let mockApiService: any;
  let mockRouter: any;

  beforeEach(async () => {
     
    (window as any).toastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
      warning: jasmine.createSpy('warning'),
      options: {}
    };

    mockApiService = { register: jasmine.createSpy('register') };
    mockRouter = { navigate: jasmine.createSpy('navigate') };

    await TestBed.configureTestingModule({
      imports: [Registerpage, CommonModule, FormsModule, ReactiveFormsModule],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Registerpage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit runs here
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should register successfully and navigate', fakeAsync(() => {
    component.registerForm.controls['userName'].setValue('test@gmail.com');
    component.registerForm.controls['password'].setValue('Password1!');
    component.registerForm.controls['confirmPassword'].setValue('Password1!');
    component.registerForm.controls['role'].setValue('User');
    component.registerForm.controls['extraField'].setValue('');

    const hashedPassword = CryptoJS.SHA256('Password1!').toString(CryptoJS.enc.Hex);
    mockApiService.register.and.returnValue(of({ message: 'Registered successfully' }));

    component.onRegister();
    tick();

    expect(mockApiService.register).toHaveBeenCalledWith({
      userName: 'test@gmail.com',
      password: hashedPassword,
      role: 'User'
    });
    expect((window as any).toastr.success).toHaveBeenCalledWith('Registered successfully', 'Success');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should show error if passwords do not match', () => {
    component.registerForm.controls['password'].setValue('Password1!');
    component.registerForm.controls['confirmPassword'].setValue('Password2!');
    component.registerForm.controls['userName'].setValue('test@gmail.com');
    component.registerForm.controls['extraField'].setValue('');

    component.onRegister();

    expect((window as any).toastr.error).toHaveBeenCalledWith('Passwords do not match!', 'Error');
    expect(mockApiService.register).not.toHaveBeenCalled();
  });

  it('should block submission if honeypot triggered', () => {
    component.registerForm.controls['extraField'].setValue('bot');
    component.registerForm.controls['password'].setValue('Password1!');
    component.registerForm.controls['confirmPassword'].setValue('Password1!');
    component.registerForm.controls['userName'].setValue('test@gmail.com');

    component.onRegister();

    expect((window as any).toastr.warning)
      .toHaveBeenCalledWith('Suspicious activity detected. Submission blocked.', 'Warning');
    expect(mockApiService.register).not.toHaveBeenCalled();
  });

  it('should call toastr.error if API fails', fakeAsync(() => {
    component.registerForm.controls['userName'].setValue('test@gmail.com');
    component.registerForm.controls['password'].setValue('Password1!');
    component.registerForm.controls['confirmPassword'].setValue('Password1!');
    component.registerForm.controls['role'].setValue('User');
    component.registerForm.controls['extraField'].setValue('');

    mockApiService.register.and.returnValue(throwError({ error: { message: 'Server error' } }));

    component.onRegister();
    tick();

    expect((window as any).toastr.error).toHaveBeenCalledWith('Server error', 'Error');
  }));

  it('should toggle password visibility', () => {
    const initial = component.showPassword;
    component.togglePassword();
    expect(component.showPassword).toBe(!initial);
  });

  it('should toggle confirm password visibility', () => {
    const initial = component.showConfirmPassword;
    component.toggleConfirmPassword();
    expect(component.showConfirmPassword).toBe(!initial);
  });

  it('should navigate to login page', () => {
    component.goToLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
