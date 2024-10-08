import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  inject,
  Input,
  OnInit,
  PLATFORM_ID,
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
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Message } from '../../../../models/message.class';
import { ThreadService } from '../../../services/thread.service';
import { ChannelSelectionService } from '../../../services/channel-selection.service';
import { AuthService } from '../../../services/auth.service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { SidebarService } from '../../../services/sidebar.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ResponsiveService } from '../../../services/responsive.service';
import { ChatAreaService } from '../../../services/chat-area.service';

@Component({
  selector: 'app-thread-chat-area',
  standalone: true,
  imports: [CommonModule, PickerComponent],
  templateUrl: './thread-chat-area.component.html',
  styleUrl: './thread-chat-area.component.scss',
})
export class ThreadChatAreaComponent implements OnInit, AfterViewInit {
  @Input() threadId: any;

  //   // constructor(
  //   //   private threadService: ThreadService,
  //   //   private firestore: Firestore,
  //   //   private channelSelectionService: ChannelSelectionService,
  //   //   private cd: ChangeDetectorRef
  //   // ) {}

  //   authService = inject(AuthService);

  //   allMessagesSortedDate: any = [];
  //   allMessagesSorted: Message[] = [];
  //   allMessages: Message[] = [];
  //   allUser: any = [];
  //   allDates: any = [];
  //   dateCounter = 0;
  //   scrolled = true;
  //   date = false;
  //   emojiselectior = false;
  //   emojiSelector = false;
  //   openEditMessage: any = '';
  //   editedMessage: any;
  //   user: any;

  //   reactions = [
  //     {
  //       name: 'checkMark',
  //       icon: './../../../../assets/reactions/check-mark.png',
  //     },
  //     { name: 'handshake', icon: './../../../../assets/reactions/handshake.png' },
  //     { name: 'thumbsUp', icon: './../../../../assets/reactions/thumbs-up.png' },
  //     {
  //       name: 'thumbsDown',
  //       icon: './../../../../assets/reactions/thumbs-down.png',
  //     },
  //     { name: 'rocket', icon: './../../../../assets/reactions/rocket.png' },
  //     { name: 'nerdFace', icon: './../../../../assets/reactions/nerd-face.png' },
  //     {
  //       name: 'shushingFace',
  //       icon: './../../../../assets/reactions/shushing-face.png',
  //     },
  //   ];

  //   @ViewChild('messageContainer') private messageContainer?: ElementRef;
  //   containerClasses: { [key: string]: boolean } = {};

  //   @ViewChildren('messageList') messageLoaded!: QueryList<any>;
  //   @ViewChild('messageTextarea') messageTextarea: any;

  //   @ViewChild('myDiv') myDiv!: ElementRef;
  //   currentChannel: any;
  //   currentChannelId: any;
  //   channelInfo = inject(SidebarService);

  //   constructor(
  //     private threadService: ThreadService,
  //     private firestore: Firestore,
  //     public channelSelectionService: ChannelSelectionService,
  //     private sanitizer: DomSanitizer,
  //     @Inject(PLATFORM_ID) private platformId: Object
  //   ) {}

  //   ngOnInit(): void {
  //     if (isPlatformBrowser(this.platformId)) {
  //       document.addEventListener('click', this.handleClick.bind(this));
  //     }
  //   }

  //   setOpenUser() {
  //     this.user = this.authService.currentUserSignal()?.uId;
  //   }

  //   ngAfterViewInit(): void {
  //     this.channelSelectionService.getSelectedChannel().subscribe((channel) => {
  //       this.currentChannelId = channel;
  //       this.subUser();
  //       this.subMessages();
  //     });

  //     this.messageLoaded.changes.subscribe((t) => {
  //       if (this.scrolled) {
  //         this.scrolled = false;
  //         this.scrollToBottom();
  //       }
  //     });
  //   }

  //   // this.channelSelectionService.getSelectedChannel().subscribe((channel) => {
  //   //   this.currentChannel = channel;
  //   //   this.onChannelChange(channel);
  //   // });

  //   // this.messageLoaded.changes.subscribe((t) => {
  //   //   if (this.scrolled) {
  //   //     this.scrolled = false;
  //   //     this.scrollToBottom();
  //   //   }
  //   // });
  //   // this.subMessages(); // Move subMessages to ngAfterViewInit to ensure View is initialized

  //   hasReaction(message: any, reactionName: string): boolean {
  //     return message[reactionName] && message[reactionName].length > 0;
  //   }

  //   hasUserReacted(message: any, reactionName: string): boolean {
  //     const userId = this.authService.currentUserSignal()?.uId;
  //     return message[reactionName]?.split(' ').includes(userId);
  //   }

  //   getReactionCount(message: any, reactionName: string): number {
  //     const reactions = message[reactionName];
  //     if (reactions) {
  //       return reactions.split(' ').length;
  //     }
  //     return 0;
  //   }

  //   subChannels() {
  //     const q = query(collection(this.firestore, 'Channels'), limit(1000));
  //     onSnapshot(q, (list) => {
  //       let channel: any;
  //       list.forEach((element) => {
  //         channel = this.setNoteChannel(element.data(), element.id);
  //         if ((channel.id = this.currentChannelId)) {
  //           this.currentChannel = channel;
  //         }
  //       });
  //     });
  //   }

  //   setNoteChannel(obj: any, id: string) {
  //     return {
  //       id: id,
  //       channelCreator: obj.channelCreator || '',
  //       description: obj.description || '',
  //       images: obj.images || '',
  //       name: obj.name || '',
  //       users: obj.users || '',
  //     };
  //   }

  //   openThread(thread: any) {
  //     if (this.threadService.isThreadOpen()) {
  //       this.threadService.closeThread();
  //       setTimeout(() => {
  //         this.threadService.openThread(thread);
  //       }, 300);
  //     } else {
  //       this.threadService.openThread(thread);
  //     }
  //   }

  //   subMessages() {
  //     const q = query(
  //       collection(
  //         this.firestore,
  //         'Channels',
  //         this.currentChannelId,
  //         'messages',
  //         this.threadId,
  //         'thread'
  //       ),
  //       limit(1000)
  //     );
  //     onSnapshot(q, (list) => {
  //       this.allMessages = [];
  //       list.forEach((element) => {
  //         this.allMessages.push(this.setNoteObject(element.data(), element.id));
  //       });
  //       this.sortMessages();
  //       this.dateLoaded();
  //     });
  //   }

  //   subUser() {
  //     const q = query(collection(this.firestore, 'Users'), limit(1000));
  //     onSnapshot(q, (list) => {
  //       this.allUser = [];
  //       list.forEach((element) => {
  //         this.allUser.push(this.setNoteObjectUser(element.data(), element.id));
  //       });
  //       this.setOpenUser();
  //     });
  //   }

  //   setNoteObjectUser(obj: any, id: string) {
  //     return {
  //       email: obj.email || '',
  //       image: obj.image || '',
  //       name: obj.name || '',
  //       uid: obj.uid || '',
  //     };
  //   }

  //   setNoteObject(obj: any, id: string): Message {
  //     return {
  //       id: id,
  //       uid: obj.uid || '',
  //       message: obj.message || '',
  //       weekday: obj.weekday || '',
  //       year: obj.year || '',
  //       month: obj.month || '',
  //       day: obj.day || '',
  //       hour: obj.hour || '',
  //       minute: obj.minute || '',
  //       seconds: obj.seconds || '',
  //       milliseconds: obj.milliseconds || '',
  //       user: obj.user || '',
  //       fileUrl: obj.fileUrl || '',
  //       fileName: obj.fileName || '',
  //       threadCount: obj.threadCount || '',
  //       checkMark: obj.checkMark || '',
  //       handshake: obj.handshake || '',
  //       thumbsUp: obj.thumbsUp || '',
  //       thumbsDown: obj.thumbsDown || '',
  //       rocket: obj.rocket || '',
  //       nerdFace: obj.nerdFace || '',
  //       noted: obj.noted || '',
  //       shushingFace: obj.shushingFace || '',
  //     };
  //   }

  //   sortMessages(): void {
  //     this.allMessagesSorted = [];
  //     this.allMessagesSorted = [...this.allMessages].sort((a, b) => {
  //       const dateA = new Date(
  //         a.year,
  //         a.month - 1,
  //         a.day,
  //         a.hour,
  //         a.minute,
  //         a.seconds
  //       );
  //       const dateB = new Date(
  //         b.year,
  //         b.month - 1,
  //         b.day,
  //         b.hour,
  //         b.minute,
  //         b.seconds
  //       );
  //       return dateA.getTime() - dateB.getTime(); // Älteste zuerst, daher umgekehrt
  //     });
  //   }

  //   scrollToBottom(): void {
  //     if (typeof window !== 'undefined') {
  //       // Browser-spezifischer Code hier
  //       const container = document.getElementById('messageContainer');
  //       if (container) {
  //         container.scrollTop = container.scrollHeight;
  //       }
  //     }
  //   }

  //   dateLoaded() {
  //     this.allMessagesSortedDate = [];
  //     this.allDates = [];

  //     for (let i = 0; i < this.allMessagesSorted.length; i++) {
  //       const element = this.allMessagesSorted[i];
  //       let date =
  //         element.day.toString().padStart(2, '0') +
  //         '.' +
  //         element.month.toString().padStart(2, '0') +
  //         '.' +
  //         element.year.toString();

  //       this.dateCounter++;

  //       if (Array.isArray(this.allDates) && this.allDates.includes(date)) {
  //         element.date = false;
  //       } else {
  //         this.allDates.push(date);
  //         element.date = true;
  //       }
  //     }
  //     this.allMessagesSortedDate = this.allMessagesSorted;
  //   }

  //   getMonthName(monthNumber: number): string {
  //     const months: string[] = [
  //       'Januar',
  //       'Februar',
  //       'März',
  //       'April',
  //       'Mai',
  //       'Juni',
  //       'Juli',
  //       'August',
  //       'September',
  //       'Oktober',
  //       'November',
  //       'Dezember',
  //     ];

  //     if (monthNumber < 1 || monthNumber > 12) {
  //       throw new Error(
  //         'Ungültige Monatszahl. Bitte geben Sie eine Zahl zwischen 1 und 12 ein.'
  //       );
  //     }

  //     return months[monthNumber - 1];
  //   }

  //   getFormattedTime(hour: any, minute: any): any {
  //     const hours = hour.toString().padStart(2, '0');
  //     const minutes = minute.toString().padStart(2, '0');
  //     return `${hours}:${minutes} Uhr`;
  //   }

  //   onChannelChange(channel: string): void {
  //     setTimeout(() => {
  //       this.subMessages(); // Ensure messages are fetched on channel change
  //     }, 10);
  //   }

  //   getUsername(uid: string): string {
  //     const user = this.allUser.find((user: any) => user.uid === uid);
  //     return user ? user.name : 'Unbekannt';
  //   }

  //   getProfileImg(uid: any) {
  //     for (let i = 0; i < this.allUser.length; i++) {
  //       const element = this.allUser[i];
  //       if (element.uid === uid) {
  //         return element.image;
  //       }
  //     }
  //   }

  //   openEmojiSelection() {
  //     this.emojiselectior = !this.emojiselectior;
  //   }

  //   closeEmojiSelector() {
  //     this.emojiselectior = false;
  //   }

  //   addReaction(reaction: any, message: any) {
  //     this.updateMessageVariable(
  //       message.id,
  //       this.authService.currentUserSignal()?.uId,
  //       reaction
  //     );
  //   }

  //   async updateMessageVariable(
  //     messageId: any,
  //     newValue: any,
  //     variableName: any
  //   ) {
  //     const messageRef = doc(
  //       this.firestore,
  //       'Channels',
  //       this.currentChannelId,
  //       'messages',
  //       this.threadId,
  //       'thread',
  //       messageId
  //     );

  //     try {
  //       // Get the current value of the variable
  //       const messageSnapshot = await getDoc(messageRef);
  //       if (messageSnapshot.exists()) {
  //         const currentData = messageSnapshot.data();
  //         let currentValue = currentData[variableName] || '';

  //         // Convert currentValue to an array of values
  //         let valuesArray = currentValue.split(' ').filter((value: any) => value);

  //         if (valuesArray.includes(newValue)) {
  //           // Remove the newValue if it exists
  //           valuesArray = valuesArray.filter((value: any) => value !== newValue);
  //         } else {
  //           // Append the new value with a space if it doesn't exist
  //           valuesArray.push(newValue);
  //         }

  //         // Join the array back to a string
  //         const updatedValue = valuesArray.join(' ');

  //         // Update the document with the new value
  //         await updateDoc(messageRef, {
  //           [variableName]: updatedValue,
  //         });
  //         console.log('Document successfully updated!');
  //       } else {
  //         console.log('No such document!');
  //       }
  //     } catch (err) {
  //       console.error('Error updating document: ', err);
  //     }
  //   }

  //   splitWords(input: string) {
  //     if (input) {
  //       let words = input.trim().split(/\s+/).length;
  //       return words;
  //     } else {
  //       return 0;
  //     }
  //   }

  //   isItToday(message: any) {
  //     const now = new Date();
  //     if (
  //       message.year == now.getFullYear() &&
  //       message.month == now.getMonth() + 1 &&
  //       message.day == now.getDate()
  //     ) {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   }

  //   editMessage(message: any) {
  //     this.editedMessage = message.message;
  //     if (this.openEditMessage == message.id) {
  //       this.openEditMessage = false;
  //       this.emojiSelector = false;
  //     } else {
  //       this.openEditMessage = message.id;
  //       this.emojiSelector = false;
  //     }
  //   }

  //   openEmojiSelector() {
  //     this.emojiSelector = !this.emojiSelector;
  //   }

  //   insertEmoji(emoji: any) {
  //     const textarea: HTMLTextAreaElement = this.messageTextarea.nativeElement;

  //     // Aktuelle Position des Cursors
  //     const startPos = textarea.selectionStart;
  //     const endPos = textarea.selectionEnd;

  //     // Wert des Textarea-Felds aktualisieren
  //     this.editedMessage =
  //       textarea.value.substring(0, startPos) +
  //       emoji +
  //       textarea.value.substring(endPos, textarea.value.length);

  //     // Cursor-Position nach dem Einfügen des Textes setzen
  //     setTimeout(() => {
  //       textarea.selectionStart = textarea.selectionEnd = startPos + emoji.length;
  //     }, 0);
  //   }

  //   addEmoji($event: any) {
  //     let element = $event;
  //     this.insertEmoji(element['emoji'].native);
  //   }

  //   saveEdit(message: any) {
  //     this.updateMessage(message.id);
  //     this.openEditMessage = '';
  //   }

  //   async updateMessage(messageId: any) {
  //     const messageRef = doc(
  //       this.firestore,
  //       'Channels',
  //       this.currentChannelId,
  //       'messages',
  //       this.threadId,
  //       'thread',
  //       messageId
  //     );
  //     await updateDoc(messageRef, {
  //       message: this.editedMessage,
  //     });
  //   }

  //   onMessageInput(event: Event) {
  //     const textarea = event.target as HTMLTextAreaElement;
  //     this.editedMessage = textarea.value;
  //   }

  //   reacted(id: any) {
  //     if (id.includes(this.user)) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   }

  //   getMessage(message: any): SafeHtml {
  //     const regex = /₿ЯæŶ∆Ωг(\S+)/g;
  //     const modifiedMessage = message.message.replace(
  //       regex,
  //       (match: any, p1: any) => {
  //         const spanClass =
  //           message.uid !== this.authService.currentUserSignal()?.uId
  //             ? 'tagHighlight'
  //             : 'tagHighlightSend';
  //         return `<span class="${spanClass}" data-uid="${p1}">@${this.getUsername(
  //           p1
  //         )}</span>`;
  //       }
  //     );

  //     return this.sanitizer.bypassSecurityTrustHtml(modifiedMessage);
  //   }

  //   handleClick(event: Event) {
  //     const target = event.target as HTMLElement;

  //     // Überprüfen, ob das angeklickte Element eine der span-Tags ist
  //     if (
  //       target.classList.contains('tagHighlight') ||
  //       target.classList.contains('tagHighlightSend')
  //     ) {
  //       const uid = target.getAttribute('data-uid');
  //       if (uid) {
  //         this.openUserProfil(uid);
  //       }
  //     }
  //   }

  //   openUserProfil(uid: any) {
  //     this.channelInfo.userProfilOpen = true;
  //     this.channelInfo.activeUserProfil = 0;
  //     this.channelInfo.activeUser = this.getUser(uid).name;
  //     this.channelInfo.activeEmail = this.getUser(uid).email;
  //     this.channelInfo.activeImage = this.getUser(uid).image;
  //     this.channelInfo.activeUid = uid;
  //   }

  //   getUser(uid: any) {
  //     for (let i = 0; i < this.allUser.length; i++) {
  //       const element = this.allUser[i];
  //       if (element.uid === uid) {
  //         return element;
  //       }
  //     }
  //   }

  //   splitStringBySpace(input: string): string[] {
  //     return input.split(' ');
  //   }
  // }

  authService = inject(AuthService);

  allChannels: any = [];
  allMessagesSortedDate: any = [];
  allMessagesSorted: Message[] = [];
  allMessages: Message[] = [];
  allUser: any = [];
  allDates: any = [];
  dateCounter = 0;
  scrolled = true;
  date = false;
  emojiselectior = false;
  emojiSelector = false;
  openEditMessage: any = '';
  editedMessage: any;
  user: any;

  reactions = [
    {
      name: 'checkMark',
      icon: './../../../../assets/reactions/check-mark.png',
    },
    { name: 'handshake', icon: './../../../../assets/reactions/handshake.png' },
    { name: 'thumbsUp', icon: './../../../../assets/reactions/thumbs-up.png' },
    {
      name: 'thumbsDown',
      icon: './../../../../assets/reactions/thumbs-down.png',
    },
    { name: 'rocket', icon: './../../../../assets/reactions/rocket.png' },
    { name: 'nerdFace', icon: './../../../../assets/reactions/nerd-face.png' },
    {
      name: 'shushingFace',
      icon: './../../../../assets/reactions/shushing-face.png',
    },
  ];

  @ViewChild('messageContainer') private messageContainer?: ElementRef;
  containerClasses: { [key: string]: boolean } = {};

  @ViewChildren('messageList') messageLoaded!: QueryList<any>;
  @ViewChild('messageTextarea') messageTextarea: any;
  @ViewChild('inputChatArea') inputChatArea: any;

  currentChannel: any;
  currentChannelId: any;
  channelInfo = inject(SidebarService);
  responsiveService = inject(ResponsiveService);
  $event: any;

  constructor(
    private threadService: ThreadService,
    private firestore: Firestore,
    public channelSelectionService: ChannelSelectionService,
    public chatAreaService: ChatAreaService,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  setOpenUser() {
    this.user = this.authService.currentUserSignal()?.uId;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('click', this.handleClick.bind(this));
    }
  }

  ngAfterViewInit(): void {
    this.channelSelectionService.getSelectedChannel().subscribe((channel) => {
      this.currentChannelId = channel;
      this.subUser();
      this.subMessages();
      this.subChannels();
      setTimeout(() => {
        this.scrollToBottom();
      }, 5);
    });

    this.messageLoaded.changes.subscribe((t) => {
      if (this.scrolled) {
        this.scrolled = false;
        this.scrollToBottom();
      }
    });
  }

  setImg(src: any) {
    this.channelSelectionService.setSelectedImg(src);
  }

  subChannels() {
    const q = query(collection(this.firestore, 'Channels'), limit(1000));
    onSnapshot(q, (list) => {
      this.allChannels = [];
      let channel: any;
      list.forEach((element) => {
        channel = this.chatAreaService.setNoteChannel(
          element.data(),
          element.id
        );
        this.allChannels.push(channel);

        if (channel.id == this.currentChannelId) {
          this.currentChannel = channel;
        }
      });
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
      this.responsiveService.isThreadOpen = true;
    }
  }

  subMessages() {
    const q = query(
      collection(
        this.firestore,
        'Channels',
        this.currentChannelId,
        'messages',
        this.threadId,
        'thread'
      ),
      limit(1000)
    );
    onSnapshot(q, (list) => {
      this.allMessages = [];
      list.forEach((element) => {
        this.allMessages.push(
          this.chatAreaService.setNoteObject(element.data(), element.id)
        );
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
        this.allUser.push(
          this.chatAreaService.setNoteObjectUser(element.data(), element.id)
        );
      });
      this.setOpenUser();
    });
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

  scrollToBottom() {
    if (typeof window !== 'undefined') {
      // Browser-spezifischer Code hier
      const container = document.getElementById('messageContainer');
      container!.scrollTop = container!.scrollHeight;
    }
    return false;
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

  onChannelChange(channel: string): void {
    setTimeout(() => {
      this.subMessages(); // Ensure messages are fetched on channel change
    }, 10);
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

  addReaction(reaction: any, message: any) {
    let src = [
      this.firestore,
      'Channels',
      this.currentChannelId,
      'messages',
      this.threadId,
      'thread',
      message.id,
    ]; // src kann so lang sein, wie du es brauchst
    this.chatAreaService.updateMessageVariable(
      message.id,
      this.authService.currentUserSignal()?.uId,
      reaction,
      src
    );
  }

  getChannelCreator(uid: any) {
    if (uid == this.authService.currentUserSignal()?.uId) {
      return 'Du hast diesen Channel';
    } else {
      if (this.getUser(uid)) {
        return this.getUser(uid).name + ' ' + 'hat diesen Channel';
      } else {
        return 'undefined';
      }
    }
  }

  editMessage(message: any) {
    this.editedMessage = message.message;
    if (this.openEditMessage == message.id) {
      this.openEditMessage = false;
      this.emojiSelector = false;
    } else {
      this.openEditMessage = message.id;
      this.emojiSelector = false;
      this.getMessageEdit(message);
    }
  }

  openEmojiSelector() {
    this.emojiSelector = !this.emojiSelector;
  }

  insertEmoji(emoji: any) {
    const textarea: HTMLTextAreaElement = this.messageTextarea.nativeElement;

    // Aktuelle Position des Cursors
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;

    // Wert des Textarea-Felds aktualisieren
    this.editedMessage =
      textarea.value.substring(0, startPos) +
      emoji +
      textarea.value.substring(endPos, textarea.value.length);

    // Cursor-Position nach dem Einfügen des Textes setzen
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = startPos + emoji.length;
    }, 0);
  }

  addEmoji($event: any) {
    let element = $event;
    this.insertEmoji(element['emoji'].native);
  }

  saveEdit(event: any, message: any) {
    let editedMessage = this.inputChatArea.nativeElement.innerHTML;
    this.updateMessage(event, message.id);
    this.openEditMessage = '';
  }

  async updateMessage(event: any, messageId: string) {
    event?.preventDefault();
    let message = '';
    const messageTextarea = document.querySelector(
      '.textAreaChatArea'
    ) as HTMLElement;

    if (messageTextarea) {
      const children = messageTextarea.childNodes;
      let result = '';

      children.forEach((child) => {
        if (
          child.nodeType === Node.ELEMENT_NODE &&
          (child as HTMLElement).tagName === 'SPAN'
        ) {
          // Es ist ein span-Element, extrahiere das data-uid
          const uid = (child as HTMLElement).getAttribute('data-uid');
          if (uid) {
            // Überprüfe das erste Zeichen des data-uid
            const firstChar = (child as HTMLElement).innerHTML.charAt(0);
            if (firstChar === '@') {
              result += `₿ЯæŶ∆Ωг${uid} `;
            } else if (firstChar === '#') {
              result += `₣Ж◊ŦΨø℧${uid} `;
            } else {
              // Standardfall, falls das erste Zeichen weder @ noch # ist
              result += `${uid} `;
            }
          }
        } else if (child.nodeType === Node.TEXT_NODE) {
          // Es ist ein Textknoten, füge den Textinhalt hinzu
          result += child.textContent;
        }
      });

      // Speichere das Ergebnis in der message.message Variable
      message = result.trim(); // Ergebnis z.B.: "asddasd @zqk0MWq9TcWYUdYtXpTTKsnFro12 sdasad @7gMhlfm1xsVsPe7Hq7kdIPzLMQJ2"
    }

    // Nachricht in der Firestore-Datenbank aktualisieren
    const messageRef = doc(
      this.firestore,
      'Channels',
      this.currentChannelId,
      'messages',
      this.threadId,
      'thread',
      messageId
    );

    await updateDoc(messageRef, {
      message: message.trim(),
      updatedAt: new Date(), // Optional: Zeitpunkt der letzten Änderung speichern
    }).catch((err) => {
      console.error('Fehler beim Aktualisieren der Nachricht:', err);
    });
  }

  // async updateMessage(messageId: any) {
  //   const messageRef = doc(
  //     this.firestore,
  //     'Channels',
  //     this.currentChannelId,
  //     'messages',
  //     messageId
  //   );
  //   await updateDoc(messageRef, {
  //     message: this.editedMessage,
  //   });
  // }

  onMessageInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.editedMessage = textarea.value;
  }

  reacted(id: any) {
    if (id.includes(this.user)) {
      return true;
    } else {
      return false;
    }
  }

  getMessage(message: any): SafeHtml {
    const regexUser = /₿ЯæŶ∆Ωг(\S+)/g;
    const regexChannel = /₣Ж◊ŦΨø℧(\S+)/g;
    let modifiedMessage = message.message.replace(
      regexUser,
      (match: any, p1: any) => {
        if (this.getUser(p1) != undefined) {
          const spanClass =
            message.uid !== this.authService.currentUserSignal()?.uId
              ? 'tagHighlight'
              : 'tagHighlightSend';
          return /*html*/ `
          <span class="${spanClass}" data-uid="${p1}" contentEditable="false" data-uid = "${p1}">@${
            this.getUser(p1).name
          }</span>`;
        } else {
          return 'undefined';
        }
      }
    );

    modifiedMessage = modifiedMessage.replace(
      regexChannel,
      (match: any, p1: any) => {
        const spanClass =
          message.uid !== this.authService.currentUserSignal()?.uId
            ? 'tagHighlightChannel'
            : 'tagHighlightSendChannel';
        if (this.getChannel(p1) != undefined) {
          return /*html*/ `
          <span class="${spanClass}" data-uid="${p1}" contentEditable="false" data-uid = "${p1}">#${
            this.getChannel(p1).name
          }</span>`;
        } else {
          return 'undefined';
        }
      }
    );

    return this.sanitizer.bypassSecurityTrustHtml(modifiedMessage);
  }

  getMessageEdit(message: any) {
    const regexUser = /₿ЯæŶ∆Ωг(\S+)/g;
    const regexChannel = /₣Ж◊ŦΨø℧(\S+)/g;
    let modifiedMessage = message.message.replace(
      regexUser,
      (match: any, p1: any) => {
        if (this.getUser(p1) != undefined) {
          const spanClass = 'tagHighlight';
          return `<span class="${spanClass}" data-uid="${p1}" contentEditable="false">@${
            this.getUser(p1).name
          }</span>`;
        } else {
          return 'undefined';
        }
      }
    );

    modifiedMessage = modifiedMessage.replace(
      regexChannel,
      (match: any, p1: any) => {
        if (this.getChannel(p1) != undefined) {
          const spanClass = 'tagHighlightChannel';
          return `<span class="${spanClass}" data-uid="${p1}" contentEditable="false">#${
            this.getChannel(p1).name
          }</span>`;
        } else {
          return 'undefined';
        }
      }
    );

    this.insertHTML(modifiedMessage);
  }

  insertHTML(htmlContent: any) {
    const interval = setInterval(() => {
      if (this.inputChatArea && this.inputChatArea.nativeElement) {
        this.inputChatArea.nativeElement.innerHTML = htmlContent;

        clearInterval(interval);
      }
    }, 100);
  }

  handleClick(event: Event) {
    const target = event.target as HTMLElement;

    // Überprüfen, ob das angeklickte Element eine der span-Tags ist
    if (
      target.classList.contains('tagHighlight') ||
      target.classList.contains('tagHighlightSend')
    ) {
      const uid = target.getAttribute('data-uid');
      if (uid) {
        this.openUserProfil(uid);
      }
    } else if (
      target.classList.contains('tagHighlightChannel') ||
      target.classList.contains('tagHighlightSendChannel')
    ) {
      const uid = target.getAttribute('data-uid');
      if (uid) {
        this.openChannel(uid);
      }
    }
  }

  openChannel(uid: any) {
    const currentUserId = this.authService.currentUserSignal()?.uId;

    for (let i = 0; i < this.getChannel(uid).uids.length; i++) {
      const element = this.getChannel(uid).uids[i];
      if (
        element.includes(currentUserId) ||
        uid == 'wXzgNEb34DReQq3fEsAo7VTcXXNA'
      ) {
        this.channelSelectionService.openChannel();
        this.channelSelectionService.setSelectedChannel(uid);
      }
    }
  }

  openUserProfil(uid: any) {
    this.channelInfo.userProfilOpen = true;
    this.channelInfo.activeUserProfil = 0;
    this.channelInfo.activeUser = this.getUser(uid).name;
    this.channelInfo.activeEmail = this.getUser(uid).email;
    this.channelInfo.activeImage = this.getUser(uid).image;
    this.channelInfo.activeUid = uid;
  }

  getUser(uid: any) {
    for (let i = 0; i < this.allUser.length; i++) {
      const element = this.allUser[i];
      if (element.uid === uid) {
        return element;
      }
    }
    return { name: undefined };
  }

  getChannel(id: any) {
    for (let i = 0; i < this.allChannels.length; i++) {
      const element = this.allChannels[i];
      if (element.id === id) {
        return element;
      }
    }
    return undefined; // wird zurückgegeben, wenn nichts gefunden wurde
  }

  splitStringBySpace(input: string): string[] {
    return input.split(' ');
  }
}
