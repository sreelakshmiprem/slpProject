import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ResetPassword } from './reset-password';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api-service';
import { CommonModule } from '@angular/common';
import { of, throwError, Subject } from 'rxjs';

describe('ResetPassword', () => {
  let component: ResetPassword;
  let fixture: ComponentFixture<ResetPassword>;
  let apiServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
  
    (window as any).toastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
      warning: jasmine.createSpy('warning'),
      options: {}
    };

    apiServiceMock = { resetRequest: jasmine.createSpy('resetRequest') };
    routerMock = { navigate: jasmine.createSpy('navigate') };

    await TestBed.configureTestingModule({
      imports: [ResetPassword, CommonModule, FormsModule, ReactiveFormsModule], // standalone component
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should block submit when email is empty', () => {
    component.forgotPasswordForm.controls['email'].setValue('');
    component.onSubmit();

    expect((window as any).toastr.warning).not.toHaveBeenCalled();
    expect(apiServiceMock.resetRequest).not.toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
  });

  it('should call API and navigate on successful reset request', fakeAsync(() => {
    const subject = new Subject<any>();
    apiServiceMock.resetRequest.and.returnValue(subject.asObservable());

    component.forgotPasswordForm.controls['email'].setValue('test@gmail.com');
    component.forgotPasswordForm.controls['extraField'].setValue('');

    component.onSubmit();

     
    expect(component.isLoading).toBeTrue();
    expect(apiServiceMock.resetRequest).toHaveBeenCalledWith({ userName: 'test@gmail.com' });
 
    subject.next({ success: true });
    subject.complete();
    tick();  

    expect(component.isLoading).toBeFalse();
    expect((window as any).toastr.success).toHaveBeenCalledWith('Reset link sent to your email.', 'Success');
 
    tick(3000);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should show error when API fails', fakeAsync(() => {
    apiServiceMock.resetRequest.and.returnValue(throwError({ error: { Message: 'API Error' } }));

    component.forgotPasswordForm.controls['email'].setValue('test@gmail.com');
    component.forgotPasswordForm.controls['extraField'].setValue('');

    component.onSubmit();
    tick();  

    expect((window as any).toastr.error).toHaveBeenCalledWith('API Error', 'Error');
    expect(component.isLoading).toBeFalse();
  }));

  it('should trigger honeypot warning on focus', fakeAsync(() => {
    component.onHoneypotFocus();
    expect(component['honeypotTriggered']).toBeTrue();

    tick(5000);
    expect((window as any).toastr.warning).toHaveBeenCalledWith('Bot detected: trap field focused', 'Warning');
  }));

  it('should clear honeypot timer on blur', () => {
    component.onHoneypotFocus();
    component.onHoneypotBlur();

    expect(component['honeypotTriggered']).toBeFalse();
    expect(component['honeypotTimer']).toBeNull();
  });
});
