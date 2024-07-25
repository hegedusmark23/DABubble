import { Component } from '@angular/core';
import { ChannelHeaderComponent } from '../channel-header/channel-header.component';
import { ChannelChatAreaComponent } from '../channel-chat-area/channel-chat-area.component';
import { ChannelMessageInputComponent } from '../channel-message-input/channel-message-input.component';
import { ThreadComponent } from '../../thread/thread/thread.component';
import { CommonModule } from '@angular/common';
import { ThreadService } from '../../../services/thread.service';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [
    ChannelHeaderComponent,
    ChannelChatAreaComponent,
    ChannelMessageInputComponent,
    ThreadComponent,
    CommonModule,
  ],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss',
})
export class ChannelComponent {
  currentThread: any;

  constructor(private threadService: ThreadService) {
    this.threadService.currentThread$.subscribe((thread) => {
      this.currentThread = thread;
    });
  }
}
