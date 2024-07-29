import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThreadService } from '../thread.service';
import { Thread } from '../thread';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-create-thread',
  templateUrl: './create-thread.component.html',
  styleUrls: ['./create-thread.component.css']
})
export class CreateThreadComponent {
  threadForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private threadService: ThreadService
  ) {
    this.threadForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      userId: [null] //,Validators.required]
    });
  }

  onSubmit(): void {
    if (this.threadForm.valid) {
      const newThread: Thread = {
        id: 1,
        name: this.threadForm.get('name')?.value,
        userId: 1,//this.threadForm.get('userId')?.value,
        createdAt: new Date()
      };

      this.threadService.createThread(newThread).subscribe(
        response => {
          console.log('Thread created successfully:', response);
          this.threadForm.reset();
        },
        error => {
          console.error('Error creating thread:', error);
        }
      );
    }
  }
}
