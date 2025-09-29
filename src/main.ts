import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { AuthInterceptor } from './app/Interceptor/auth-interceptor-interceptor';
import { RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha-2';
import { importProvidersFrom } from '@angular/core';
// import { provideAnimations } from '@angular/platform-browser/animations';
// import { ToastrModule } from 'ngx-toastr';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: '6LewtMQrAAAAACHNXAds6v6H9DGVs6ucyx7Rcpxe', // your site key
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // provideAnimations(), 
    // importProvidersFrom(
    //   ToastrModule.forRoot({
    //     closeButton: true,
    //     progressBar: true,
    //     preventDuplicates: true,
    //     newestOnTop: false, 
    //   })
    // ),
  ],
});