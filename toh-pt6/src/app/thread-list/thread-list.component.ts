import { Component, OnInit } from '@angular/core';
import { ThreadService } from '../thread.service';
import { Thread } from '../thread';


@Component({
  selector: 'app-thread-list',
  templateUrl: './thread-list.component.html',
  styleUrls: ['./thread-list.component.css']
})
export class ThreadListComponent implements OnInit {
  threads: Thread[] = [];

  constructor(private threadService: ThreadService) {}

  ngOnInit(): void {
    this.loadThreads();
  }

  loadThreads(): void {
    this.threadService.getThreads().subscribe(
      (data: Thread[]) => this.threads = data,
      (error: any) => console.error('Error fetching threads:', error)
    );
  }

  delete(thread: Thread): void {
    if (confirm(`Are you sure you want to delete thread "${thread.name}"?`)) {
      this.threadService.deleteThread(thread.id).subscribe(
        () => this.threads = this.threads.filter(t => t.id !== thread.id),
        (error: any) => console.error('Error deleting thread:', error)
      );
    }
  }
}
