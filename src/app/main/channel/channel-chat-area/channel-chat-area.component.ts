import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
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

@Component({
  selector: 'app-channel-chat-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './channel-chat-area.component.html',
  styleUrl: './channel-chat-area.component.scss',
})
export class ChannelChatAreaComponent implements AfterViewInit {
  allMessagesSorted: Message[] = [];
  allMessages: Message[] = [];
  allDates: any = [];
  dateCounter = 0;
  private hasRendered = false;
  scrolled = true;
  @ViewChild('messageContainer') private messageContainer?: ElementRef;
  containerClasses: { [key: string]: boolean } = {};

  @ViewChildren('messageList') messageLoaded!: QueryList<any>;

  @ViewChild('myDiv') myDiv!: ElementRef;

  constructor(
    private threadService: ThreadService,
    private firestore: Firestore,
    private cdRef: ChangeDetectorRef
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

  openThread(thread: any) {
    console.log('test');

    this.threadService.openThread(thread);
  }
  subMessages() {
    const q = query(
      collection(this.firestore, 'Channels', 'Entwicklerteam', 'messages'),
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
    console.log('test0');
    if (typeof window !== 'undefined') {
      console.log('test1');
      // Browser-spezifischer Code hier
      const container = document.getElementById('messageContainer');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }

  dateLoaded(message: any) {
    if (this.dateCounter === this.allMessages.length) {
      console.log(this.dateCounter, this.allMessages.length);
      this.dateCounter = 0;
      this.allDates = [];
    }
    let date =
      message.day.toString().padStart(2, '0') +
      '.' +
      message.month.toString().padStart(2, '0') +
      '.' +
      message.year.toString();

    this.dateCounter++;

    if (Array.isArray(this.allDates) && this.allDates.includes(date)) {
      return false;
    } else {
      console.log('test');
      this.allDates.push(date);
      return true;
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
}
