import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  query,
} from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Message } from '../../../../models/message.class';
import { ThreadService } from '../../../services/thread.service';
import { ChannelSelectionService } from '../../../services/channel-selection.service';
@Component({
  selector: 'app-thread-chat-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './thread-chat-area.component.html',
  styleUrl: './thread-chat-area.component.scss',
})
export class ThreadChatAreaComponent {
  @Input() threadId: any;

  allMessagesSorted: Message[] = [];
  allMessages: Message[] = [];
  currentChannel: any;

  scrolled = true;
  @ViewChild('messageContainer') private messageContainer?: ElementRef;
  containerClasses: { [key: string]: boolean } = {};

  @ViewChildren('messageList') messageLoaded!: QueryList<any>;

  @ViewChild('myDiv') myDiv!: ElementRef;

  constructor(
    private threadService: ThreadService,
    private firestore: Firestore,
    private channelSelectionService: ChannelSelectionService
  ) {}

  ngAfterViewInit(): void {
    this.subMessages();
    this.messageLoaded.changes.subscribe((t) => {
      if (this.scrolled) {
        this.scrolled = false;
        this.scrollToBottom();
      }
    });
  }

  subMessages() {
    const q = query(
      collection(
        this.firestore,
        'Channels',
        this.currentChannel,
        'messages',
        this.threadId,
        'thread'
      ),
      limit(1000)
    );
    onSnapshot(q, (list) => {
      this.allMessages = [];
      list.forEach((element) => {
        this.allMessages.push(this.setNoteObject(element.data(), element.id));
      });
      this.sortMessages();
    });
  }

  setNoteObject(obj: any, id: string): Message {
    return {
      id: id,
      message: obj.message || '',
      weekday: obj.weekday || '',
      year: obj.year || '',
      month: obj.month || '',
      day: obj.day || '',
      hour: obj.hour || '',
      minute: obj.minute || '',
      seconds: obj.seconds || '',
      milliseconds: obj.milliseconds || '',
      user: obj.user || '',
      fileUrl: obj.fileUrl || '',
      fileName: obj.fileName || '',
    };
  }

  sortMessages(): void {
    this.allMessagesSorted = [];
    this.allMessagesSorted = [...this.allMessages].sort((a, b) => {
      const dateA = new Date(
        a.year,
        a.month - 1,
        a.day,
        a.hour,
        a.minute,
        a.seconds
      );
      const dateB = new Date(
        b.year,
        b.month - 1,
        b.day,
        b.hour,
        b.minute,
        b.seconds
      );
      return dateA.getTime() - dateB.getTime(); // Älteste zuerst, daher umgekehrt
    });
  }

  scrollToBottom(): void {
    if (typeof window !== 'undefined') {
      // Browser-spezifischer Code hier
      const container = document.getElementById('messageContainer');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }

  getFormattedTime(hour: any, minute: any): any {
    const hours = hour.toString().padStart(2, '0');
    const minutes = minute.toString().padStart(2, '0');
    return `${hours}:${minutes} Uhr`;
  }

  ngOnInit(): void {
    this.channelSelectionService.getSelectedChannel().subscribe((channel) => {
      this.currentChannel = channel;
      this.onChannelChange(channel);
    });
  }

  onChannelChange(channel: string): void {
    // Deine Logik hier
    this.subMessages(); // Ensure messages are fetched on channel change
  }
}
