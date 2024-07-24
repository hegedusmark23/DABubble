import { Component } from '@angular/core';
import { ChannelHeaderComponent } from '../channel-header/channel-header.component';
import { ChannelChatAreaComponent } from '../channel-chat-area/channel-chat-area.component';
import { ChannelMessageInputComponent } from '../channel-message-input/channel-message-input.component';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [
    ChannelHeaderComponent,
    ChannelChatAreaComponent,
    ChannelMessageInputComponent,
  ],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss',
})
export class ChannelComponent {}
