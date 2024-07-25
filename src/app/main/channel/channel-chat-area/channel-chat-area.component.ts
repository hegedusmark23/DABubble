import { Component } from '@angular/core';
import { ThreadService } from '../../../services/thread.service';

@Component({
  selector: 'app-channel-chat-area',
  standalone: true,
  imports: [],
  templateUrl: './channel-chat-area.component.html',
  styleUrl: './channel-chat-area.component.scss',
})
export class ChannelChatAreaComponent {
  constructor(private threadService: ThreadService) {}

  scrollToBottom() {
    const container = document.getElementById('messageContainer');
    container!.scrollTop = container!.scrollHeight;
  }

  openThread(thread: any) {
    this.threadService.openThread(thread);
  }
  mouseover(i: string) {
    document.getElementById('hover' + i)?.classList.toggle('d-none');
  }
}
