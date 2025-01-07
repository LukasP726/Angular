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
  availableLogs: string[] = ['application.log'];

  constructor(private commandService: CommandService) {}

  onExecuteCommand() {
    if (!this.logPath) {
      this.result = 'Vyberte prosím log z nabídky.';
      return;
    }

    // Zavolá readLog s vybraným logem
    this.commandService.readLog(this.logPath).subscribe(
      (response) => this.result = response,
      (error) => this.result = 'Error executing command'
    );
  }
}
