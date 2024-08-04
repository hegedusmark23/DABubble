import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Message } from '../../../../models/message.class';
import { ThreadService } from '../../../services/thread.service';
import { ChannelSelectionService } from '../../../services/channel-selection.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-channel-chat-area',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './channel-chat-area.component.html',
  styleUrl: './channel-chat-area.component.scss',
})
export class ChannelChatAreaComponent implements AfterViewInit, OnInit {
  authService = inject(AuthService);

  allMessagesSortedDate: any = [];
  allMessagesSorted: Message[] = [];
  allMessages: Message[] = [];
  allUser: any = [];
  allDates: any = [];
  dateCounter = 0;
  scrolled = true;
  date = false;
  emojiselectior = false;
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
    this.subUser();
    this.subMessages(); // Move subMessages to ngAfterViewInit to ensure View is initialized

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
  }

  openThread(thread: any) {
    if (this.threadService.isThreadOpen()) {
      this.threadService.closeThread();
      setTimeout(() => {
        this.threadService.openThread(thread);
      }, 300);
    } else {
      this.threadService.openThread(thread);
    }
  }

  subMessages() {
    const q = query(
      collection(this.firestore, 'Channels', this.currentChannel, 'messages'),
      limit(1000)
    );
    onSnapshot(q, (list) => {
      this.allMessages = [];
      list.forEach((element) => {
        this.allMessages.push(this.setNoteObject(element.data(), element.id));
      });
      this.sortMessages();
      this.dateLoaded();
    });
  }

  subUser() {
    const q = query(collection(this.firestore, 'Users'), limit(1000));
    onSnapshot(q, (list) => {
      this.allUser = [];
      list.forEach((element) => {
        this.allUser.push(this.setNoteObjectUser(element.data(), element.id));
      });
    });
  }

  setNoteObjectUser(obj: any, id: string) {
    return {
      email: obj.email || '',
      image: obj.image || '',
      name: obj.name || '',
      uid: obj.uid || '',
    };
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

  dateLoaded() {
    this.allMessagesSortedDate = [];
    this.allDates = [];

    for (let i = 0; i < this.allMessagesSorted.length; i++) {
      const element = this.allMessagesSorted[i];
      let date =
        element.day.toString().padStart(2, '0') +
        '.' +
        element.month.toString().padStart(2, '0') +
        '.' +
        element.year.toString();

      this.dateCounter++;

      if (Array.isArray(this.allDates) && this.allDates.includes(date)) {
        element.date = false;
      } else {
        this.allDates.push(date);
        element.date = true;
      }
    }
    this.allMessagesSortedDate = this.allMessagesSorted;
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

  getUsername(uid: any) {
    for (let i = 0; i < this.allUser.length; i++) {
      const element = this.allUser[i];
      if (element.uid === uid) {
        return element.name;
      }
    }
  }
  getProfileImg(uid: any) {
    for (let i = 0; i < this.allUser.length; i++) {
      const element = this.allUser[i];
      if (element.uid === uid) {
        return element.image;
      }
    }
  }

  openEmojiSelection() {
    this.emojiselectior = !this.emojiselectior;
  }

  closeEmojiSelector() {
    this.emojiselectior = false;
  }

  getThreadCount(message: any) {
    return 'test';
  }

  addReaction(reaction: any, message: any) {
    this.updateMessageVariable(
      message.id,
      this.authService.currentUserSignal()?.uId,
      reaction
    );
  }

  async updateMessageVariable(
    messageId: any,
    newValue: any,
    variableName: any
  ) {
    const messageRef = doc(
      this.firestore,
      'Channels',
      this.currentChannel,
      'messages',
      messageId
    );

    try {
      // Get the current value of the variable
      const messageSnapshot = await getDoc(messageRef);
      if (messageSnapshot.exists()) {
        const currentData = messageSnapshot.data();
        let currentValue = currentData[variableName] || '';

        // Convert currentValue to an array of values
        let valuesArray = currentValue.split(' ').filter((value: any) => value);

        if (valuesArray.includes(newValue)) {
          // Remove the newValue if it exists
          valuesArray = valuesArray.filter((value: any) => value !== newValue);
        } else {
          // Append the new value with a space if it doesn't exist
          valuesArray.push(newValue);
        }

        // Join the array back to a string
        const updatedValue = valuesArray.join(' ');

        // Update the document with the new value
        await updateDoc(messageRef, {
          [variableName]: updatedValue,
        });
        console.log('Document successfully updated!');
      } else {
        console.log('No such document!');
      }
    } catch (err) {
      console.error('Error updating document: ', err);
    }
  }

  splitWords(input: string) {
    if (input) {
      let words = input.trim().split(/\s+/).length;
      return words;
    } else {
      return 0;
    }
  }
}
