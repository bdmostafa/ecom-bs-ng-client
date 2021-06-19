import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ToastrInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap((evt: any) => {
        console.log(evt);
        if (evt instanceof HttpResponse) {
          if (evt.body && evt.body.success) {
            // Success notification with ToastrService
            this.toastr.success(
              evt.body.success.message,
              evt.body.success.title,
              {
                progressBar: true,
                positionClass: 'toast-top-right',
                progressAnimation: 'increasing',
                timeOut: 3000,
              }
            );
          }
        }
      }),
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse) {
          console.log(error);
          // Error handling with ToastrService
          const statusText = error.statusText;

          try {
            // If error.error is array
            if (
              typeof error.error === 'object' &&
              error.error instanceof Array
            ) {
              error.error.forEach((element) => {
                this.toastr.error(element.msg, statusText, {
                  progressBar: true,
                  positionClass: 'toast-top-right',
                  progressAnimation: 'increasing',
                  timeOut: 3000,
                });
              });
            } else {
              // When error.error is not an array
              this.toastr.error(error.error, error.statusText, {
                progressBar: true,
                positionClass: 'toast-top-right',
                progressAnimation: 'increasing',
                timeOut: 3000,
              });
            }
          } catch (e) {
            this.toastr.error('An error occurred', 'Error', {
              positionClass: 'toast-top-right',
            });
          }
          //log error
        }
        return of(error);
      })
    );
  }
}
