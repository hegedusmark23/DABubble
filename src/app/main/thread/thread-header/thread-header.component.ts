import { Component } from '@angular/core';
import { ThreadService } from '../../../services/thread.service';

@Component({
  selector: 'app-thread-header',
  standalone: true,
  imports: [],
  templateUrl: './thread-header.component.html',
  styleUrl: './thread-header.component.scss',
})
export class ThreadHeaderComponent {
  constructor(private threadService: ThreadService) {}

  closeThread() {
    this.threadService.closeThread();
  }
}
