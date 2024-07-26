import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ThreadService } from '../../../services/thread.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-channel-chat-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './channel-chat-area.component.html',
  styleUrl: './channel-chat-area.component.scss',
})
export class ChannelChatAreaComponent implements AfterViewInit {
  @ViewChild('messageContainer') private messageContainer:
    | ElementRef
    | undefined;
  containerClasses: { [key: string]: boolean } = {};

  constructor(private threadService: ThreadService) {}

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.messageContainer) {
      const hasScrollbar =
        this.messageContainer.nativeElement.scrollHeight >
        this.messageContainer.nativeElement.clientHeight;
      if (hasScrollbar) {
        console.log('Der messageContainer hat einen Scrollbalken.');
        this.containerClasses = {
          'overflow-auto': true,
          'justify-content-end': false,
        };
      } else {
        console.log('Der messageContainer hat keinen Scrollbalken.');
        this.containerClasses = {
          'overflow-auto': false,
          'justify-content-end': true,
        };
      }
    }
  }

  openThread(thread: any) {
    this.threadService.openThread(thread);
  }
  mouseover(i: string) {
    document.getElementById('hover' + i)?.classList.toggle('d-none');
  }
}
