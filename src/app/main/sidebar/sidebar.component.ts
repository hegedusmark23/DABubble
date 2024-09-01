import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { collection, getDocs, Firestore } from '@angular/fire/firestore';
import { ChannelSelectionService } from '../../services/channel-selection.service';
import { AuthService } from '../../services/auth.service';
import { ThreadService } from '../../services/thread.service';
import { DirectMessageSelectionService } from '../../services/direct-message-selection.service';
import { ResponsiveService } from '../../services/responsive.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss', './sidebar-responsive.component.scss'],
})
export class SidebarComponent implements OnInit {
  hoveredChannelTitle = false;
  activetedChannelTitle = true;
  activeUserIndex: number | null = null;
  usersTitleActive = true;

  sidebarService = inject(SidebarService);
  authService = inject(AuthService);
  responsiveService = inject(ResponsiveService);

  ngOnInit(): void {
    this.sidebarService.fetchChannels();
    this.sidebarService.fetchUsers();
  }

  constructor(
    private firestore: Firestore,
    private channelSelectionService: ChannelSelectionService,
    private threadService: ThreadService,
    public directMessageSelectionService: DirectMessageSelectionService
  ) {
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
    if (this.sidebarService.GlobalChannelUids[i].includes(this.authService.currentUserSignal()?.uId ?? '')) {
      this.sidebarService.openChannel(i);
      this.responsiveService.isChannelOpen = true;
      this.responsiveService.isSidebarOpen = false;
    }
  }

  userActive(i: number) {
    this.sidebarService.activeUserIndex = i;
    this.channelSelectionService.openDirectMessage();
    this.directMessageSelectionService.setSelectedChannel(
      this.sidebarService.AllUids[i]
    );
    this.sidebarService.activeChannelIndex = -1;
    this.responsiveService.isChannelOpen = true;
    this.responsiveService.isSidebarOpen = false;
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
