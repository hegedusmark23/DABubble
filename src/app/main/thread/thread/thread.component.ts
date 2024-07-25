import { Component, Input } from '@angular/core';
import { ThreadMessageInputComponent } from '../thread-message-input/thread-message-input.component';
import { ThreadChatAreaComponent } from '../thread-chat-area/thread-chat-area.component';
import { ThreadHeaderComponent } from '../thread-header/thread-header.component';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [
    ThreadMessageInputComponent,
    ThreadChatAreaComponent,
    ThreadHeaderComponent,
  ],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss',
})
export class ThreadComponent {
  @Input() thread: any;
}
