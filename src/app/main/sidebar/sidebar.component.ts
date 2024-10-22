import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import {
  collection,
  getDocs,
  Firestore,
  setDoc,
  doc,
  onSnapshot,
} from '@angular/fire/firestore';
import { ChannelSelectionService } from '../../services/channel-selection.service';
import { AuthService } from '../../services/auth.service';
import { ThreadService } from '../../services/thread.service';
import { DirectMessageSelectionService } from '../../services/direct-message-selection.service';
import { ResponsiveService } from '../../services/responsive.service';
import { SearchFieldComponent } from '../header/search-field/search-field.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, SearchFieldComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: [
    './sidebar.component.scss',
    './sidebar-responsive.component.scss',
  ],
})
export class SidebarComponent implements OnInit, AfterViewInit {
  hoveredChannelTitle = false;
  activetedChannelTitle = true;
  activeUserIndex: number | null = null;
  usersTitleActive = true;
  sidebarService = inject(SidebarService);
  authService = inject(AuthService);
  responsiveService = inject(ResponsiveService);
  checkUserOnlineUser = true;
  ngOnInit(): void {
    this.sidebarService.fetchChannels();
    this.sidebarService.fetchUsers();
    this.checkScreenWidth();
  }

  ngAfterViewInit(): void {
    this.elementRef.nativeElement.addEventListener(
      'mousemove',
      this.setUserOnlineCheck.bind(this)
    );
  }
  constructor(
    private firestore: Firestore,
    private channelSelectionService: ChannelSelectionService,
    private threadService: ThreadService,
    public directMessageSelectionService: DirectMessageSelectionService,
    private elementRef: ElementRef
  ) {}

  setUserOnlineCheck() {
    if (this.checkUserOnlineUser) {
      this.setUserOnline();
      this.checkUserOnlineUser = false;
    }
  }
  setUserOnline() {
    if (this.authService.currentUserSignal()) {
      this.userOnline();
      this.fetchUsersOnline();

      this.sidebarService.online = true;
      let time = new Date().getTime();
      if (this.sidebarService.asd == 0) {
        setInterval(() => {
          let newTime = new Date().getTime();
          if (this.sidebarService.online) {
            this.sidebarService.asd = newTime - time;
            this.onlineSince();
          }
        }, 3000);
      }
    }
  }

  async userOnline() {
    if (this.authService.currentUserSignal()?.uId) {
      const userRef = doc(
        collection(this.firestore, 'online'),
        this.authService.currentUserSignal()?.uId
      );
      await setDoc(userRef, this.toJSON());
    }
  }

  toJSON() {
    return {
      online: 'yes',
      onlineSince: new Date().getTime(),
      uId: this.authService.currentUserSignal()?.uId,
    };
  }

  async onlineSince() {
    if (this.authService.currentUserSignal()?.uId) {
      const userRef = doc(
        collection(this.firestore, 'online'),
        this.authService.currentUserSignal()?.uId
      );
      await setDoc(userRef, this.sinceToJSON());
    }
  }

  sinceToJSON() {
    return {
      online: 'yes',
      onlineSince: new Date().getTime(),
      uId: this.authService.currentUserSignal()?.uId,
    };
  }

  async fetchUsersOnline() {
    const usersCollection = collection(this.firestore, 'online');
    onSnapshot(
      usersCollection,
      (querySnapshot) => {
        this.sidebarService.onlineUserUidList = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (
            userData['online'] == 'yes' &&
            userData['onlineSince'] > new Date().getTime() - 4000
          ) {
            //
            this.sidebarService.onlineUserUidList.push(userData['uId']);
          }
        });
      },
      (error) => {
        console.error('Fehler beim Abrufen der Benutzerdaten:', error);
      }
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenWidth();
  }

  private checkScreenWidth(): void {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 1000) {
        this.responsiveService.responsive = true;
      } else {
        this.responsiveService.responsive = false;
      }
    }
  }

  hoverChannelTitle() {
    this.hoveredChannelTitle = true;
  }

  hoverEndChannelTitle() {
    this.hoveredChannelTitle = false;
  }

  activeteChannelTitle() {
    this.activetedChannelTitle = !this.activetedChannelTitle;
  }

  addChannel() {
    this.sidebarService.createChannelDialogActive = true;
  }

  channelActive(i: number) {
    const reverseIndex = this.sidebarService.AllChannels.length - 1 - i;
    if (
      this.sidebarService.GlobalChannelUids[reverseIndex].includes(
        this.authService.currentUserSignal()?.uId ?? ''
      ) ||
      this.sidebarService.AllChannelsIds[reverseIndex] ==
        'wXzgNEb34DReQq3fEsAo7VTcXXNA'
    ) {
      this.sidebarService.openChannel(reverseIndex);
      this.responsiveService.isChannelOpen = true;
      if (window.innerWidth < 1000) {
        this.responsiveService.isSidebarOpen = false;
      }
      this.sidebarService.activeChannelIndex = i;
    }
  }

  userActive(i: number) {
    this.sidebarService.activeUserIndex = i;
    this.channelSelectionService.openDirectMessage();
    this.directMessageSelectionService.setSelectedChannel(
      this.sidebarService.AllUids[i]
    );
    this.sidebarService.activeChannelIndex = -1;
    this.responsiveService.isDirectMessageOpen = true;
    if (window.innerWidth < 1000) {
      this.responsiveService.isSidebarOpen = false;
    }
  }

  addMessage() {
    alert('Add new message');
  }

  openUsersList() {
    this.usersTitleActive = !this.usersTitleActive;
  }

  addNewMessage() {
    this.channelSelectionService.openNewMessage();
    this.responsiveService.isDirectMessageOpen = true;
    if (window.innerWidth < 1000) {
      this.responsiveService.isSidebarOpen = false;
    }
  }
}
