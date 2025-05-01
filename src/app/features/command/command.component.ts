import { Component } from '@angular/core';
import { CommandService } from '../../core/services/command.service';

@Component({
  selector: 'app-command',
  templateUrl: './command.component.html',
  styleUrls: ['./command.component.css']
})
export class CommandComponent {

  command: string = '';
  result: string = '';
  logPath: string = '';

  // Předem definovaný seznam logů
  availableLogs: string[] = ['spring.log'];

  constructor(private commandService: CommandService) {}

  // Zavolá readLog s vybraným logem
  onExecuteCommand() {
    if (!this.logPath) {
      this.result = 'Vyberte prosím log z nabídky.';
      return;
    }    
    this.commandService.readLog(this.logPath).subscribe(
      (response) => this.result = response,
      (error) => this.result = 'Error executing command'
    );
  }
}
