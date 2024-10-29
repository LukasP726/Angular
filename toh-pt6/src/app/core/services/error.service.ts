import { Injectable } from '@angular/core';

interface ErrorDetails {
    message: string;
    status?: number;
    error?: string;
}

@Injectable({
    providedIn: 'root',
})
export class ErrorService {
    private errorDetails: ErrorDetails | null = null;

    setError(details: ErrorDetails) {
        this.errorDetails = details;
    }

    getError(): ErrorDetails | null {
        return this.errorDetails;
    }

    clearError() {
        this.errorDetails = null;
    }
}
