import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from '../../core/services/error.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private errorService: ErrorService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = 'Nastala chyba';
                let errorResponse: any = null;

                // Zpracování chybového formátu JSON
                try {
                    errorResponse = error.error instanceof Object ? error.error : JSON.parse(error.error);
                } catch (e) {
                    console.error("Chyba při parsování JSON:", e);
                }

                if (errorResponse && typeof errorResponse === 'object') {
                    // Server vrací platný JSON
                    errorMessage = errorResponse.message || error.message;
                } else if (error.error instanceof ErrorEvent) {
                    // Chyba na straně klienta
                    errorMessage = `Chyba: ${error.error.message}`;
                } else {
                    // Jiný typ chyby
                    errorMessage = `Chyba: ${error.message || error.error}`;
                }

                // Uložení chybové zprávy do ErrorService
                this.errorService.setError({
                    message: errorMessage,
                    status: error.status,
                    error: errorResponse?.error || null
                });

                console.error(errorMessage);
                return throwError(errorMessage);
            })
        );
    }
}
