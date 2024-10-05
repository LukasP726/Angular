import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThreadService } from '../../core/services/thread.service';
import { Thread } from '../../core/models/thread';
import { tap } from 'rxjs/operators';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user';

@Component({
  selector: 'app-create-thread',
  templateUrl: './create-thread.component.html',
  styleUrls: ['./create-thread.component.css']
})
export class CreateThreadComponent {
  threadForm: FormGroup;
  user: User | null=null;


  constructor(
    private fb: FormBuilder,
    private threadService: ThreadService,
    private userService: UserService
  ) {
    this.threadForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      userId: [null] //,Validators.required]
    });
  }
  

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => this.user = user);
    
  }


  onSubmit(): void {
    if (this.threadForm.valid) {
      console.log("id: ",this.user?.id!);
      const newThread: Thread = {
        id: 2,
        name: this.threadForm.get('name')?.value,
        idUser: this.user?.id!, //1,//this.threadForm.get('userId')?.value,
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
