import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  Firestore,
  collection,
  limit,
  onSnapshot,
  query,
} from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { Message } from '../../../../models/message.class';
import { ThreadService } from '../../../services/thread.service';
import { ChannelSelectionService } from '../../../services/channel-selection.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-thread-chat-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './thread-chat-area.component.html',
  styleUrl: './thread-chat-area.component.scss',
})
export class ThreadChatAreaComponent implements OnInit, AfterViewInit {
  @Input() threadId: any;

  authService = inject(AuthService);

  allMessagesSortedDate: any = [];
  allMessagesSorted: Message[] = [];
  allMessages: Message[] = [];
  allDates: any = [];
  dateCounter = 0;
  scrolled = true;
  date = false;
  @ViewChild('messageContainer') private messageContainer?: ElementRef;
  containerClasses: { [key: string]: boolean } = {};

  @ViewChildren('messageList') messageLoaded!: QueryList<any>;

  @ViewChild('myDiv') myDiv!: ElementRef;
  currentChannel = 'Entwicklerteam';

  constructor(
    private threadService: ThreadService,
    private firestore: Firestore,
    private channelSelectionService: ChannelSelectionService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.channelSelectionService.getSelectedChannel().subscribe((channel) => {
      this.currentChannel = channel;
      this.onChannelChange(channel);
    });

    this.messageLoaded.changes.subscribe((t) => {
      if (this.scrolled) {
        this.scrolled = false;
        this.scrollToBottom();
      }
    });
    this.subMessages(); // Move subMessages to ngAfterViewInit to ensure View is initialized
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
      uid: obj.uid || '',
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
      threadCount: obj.threadCount || '',
      checkMark: obj.checkMark || '',
      handshake: obj.handshake || '',
      thumbsUp: obj.thumbsUp || '',
      thumbsDown: obj.thumbsDown || '',
      rocket: obj.rocket || '',
      nerdFace: obj.nerdFace || '',
      noted: obj.noted || '',
      shushingFace: obj.shushingFace || '',
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

  getMonthName(monthNumber: number): string {
    const months: string[] = [
      'Januar',
      'Februar',
      'März',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Dezember',
    ];

    if (monthNumber < 1 || monthNumber > 12) {
      throw new Error(
        'Ungültige Monatszahl. Bitte geben Sie eine Zahl zwischen 1 und 12 ein.'
      );
    }

    return months[monthNumber - 1];
  }

  getFormattedTime(hour: any, minute: any): any {
    const hours = hour.toString().padStart(2, '0');
    const minutes = minute.toString().padStart(2, '0');
    return `${hours}:${minutes} Uhr`;
  }

  onChannelChange(channel: string): void {
    setTimeout(() => {
      this.subMessages(); // Ensure messages are fetched on channel change
    }, 10);
  }
}
