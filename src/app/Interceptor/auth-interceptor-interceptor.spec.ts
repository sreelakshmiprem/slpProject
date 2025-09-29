import { TestBed } from '@angular/core/testing';
// import { HttpInterceptorFn } from '@angular/common/http';
// import { authInterceptorInterceptor } from './auth-interceptor-interceptor';
import { AuthInterceptor } from './auth-interceptor-interceptor';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
describe('authInterceptorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let routerMock = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should redirect to login on 401 error', () => {
    httpClient.get('/test').subscribe({
      next: () => {},
      error: () => {}
    });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
