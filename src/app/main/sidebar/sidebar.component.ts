import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { collection, getDocs, Firestore } from '@angular/fire/firestore';
import { ChannelSelectionService } from '../../services/channel-selection.service';
import { AuthService } from '../../services/auth.service';
import { ThreadService } from '../../services/thread.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  hoveredChannelTitle = false;
  activetedChannelTitle = true;
  activeChannelIndex: number | null = null;
  activeUserIndex: number | null = null;
  usersTitleActive = true;

  hideOrShowSidebar = inject(SidebarService);
  authService = inject(AuthService);

  ngOnInit(): void {
    this.hideOrShowSidebar.fetchChannels();
    this.hideOrShowSidebar.fetchUsers();
  }

  constructor(
    private firestore: Firestore,
    private channelSelectionService: ChannelSelectionService,
    private threadService: ThreadService
  ) {}

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
    this.hideOrShowSidebar.createChannelDialogActive = true;
  }

  channelActive(i: number) {
    this.threadService.closeThread();
    this.channelSelectionService.openChannel();

    this.activeChannelIndex = i;
    this.channelSelectionService.setSelectedChannel(
      this.hideOrShowSidebar.AllChannelsIds[i]
    );
    this.hideOrShowSidebar.currentChannelNumber = i;
  }

  userActive(i: number) {
    this.activeUserIndex = i;
  }

  addMessage() {
    alert('Add new message');
  }

  openUsersList() {
    this.usersTitleActive = !this.usersTitleActive;
  }

  addNewMessage() {
    this.channelSelectionService.openNewMessage();
  }
}
