import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../../core/services/error.service';


@Component({
    selector: 'app-error',
    template: `
        <div *ngIf="errorDetails" class="error">
            <p><strong>Chyba:</strong> {{ errorDetails.message }}</p>
            <p *ngIf="errorDetails.status"><strong>Status:</strong> {{ errorDetails.status }}</p>
            <p *ngIf="errorDetails.error"><strong>Podrobnosti:</strong> {{ errorDetails.error }}</p>
        </div>
    `,
    styles: ['.error { color: red; }']
})
export class ErrorComponent implements OnInit {
    errorDetails: any = null;

    constructor(private errorService: ErrorService) {}

    ngOnInit() {
        this.errorDetails = this.errorService.getError();
    }
}
