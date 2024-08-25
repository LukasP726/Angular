import { Component } from '@angular/core';
import { CommandService } from '../command.service';

@Component({
  selector: 'app-command',
  templateUrl: './command.component.html',
  styleUrls: ['./command.component.css']
})
export class CommandComponent {

  command: string = '';
  result: string = '';

  constructor(private commandService: CommandService) {}

  onExecuteCommand() {
    this.commandService.executeCommand(this.command).subscribe(
      (response) => this.result = response,
      (error) => this.result = 'Error executing command'
    );
  }
}
