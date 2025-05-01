import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MessageService {
  messages: string[] = [];

// Přidá novou zprávu do seznamu zpráv
add(message: string) {
  this.messages.push(message);
}

// Vymaže všechny zprávy ze seznamu
clear() {
  this.messages = [];
}
}
