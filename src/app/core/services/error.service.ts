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

  /**
   * Nastaví detaily chyby.
   *
   * @param details - Objekt s informacemi o chybě, který bude uložen pro pozdější zobrazení nebo zpracování.
   */
  setError(details: ErrorDetails): void {
    this.errorDetails = details;
  }
  
  
  // Vrátí aktuálně uložené detaily chyby.
  getError(): ErrorDetails | null {
    return this.errorDetails;
  }
  
  
  // Vymaže aktuálně uloženou chybu.
  clearError(): void {
    this.errorDetails = null;
  }
}
