import { Component, OnInit } from "@angular/core";
import { Thread } from "../thread";
import { ThreadService } from "../thread.service";

@Component({
  selector: 'app-thread-list',
  templateUrl: './thread-list.component.html',
  styleUrls: ['./thread-list.component.css']
})
export class ThreadListComponent implements OnInit {
  threads: Thread[] = [];
  searchName: string = '';

  constructor(private threadService: ThreadService) { }

  ngOnInit(): void {
    this.loadThreads();
  }

  loadThreads(): void {
    this.threadService.getThreadsByName(this.searchName).subscribe(data => {
      this.threads = data;
    });
  }
}
