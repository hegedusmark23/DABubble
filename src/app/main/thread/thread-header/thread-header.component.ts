import { Component, inject } from '@angular/core';
import { ThreadService } from '../../../services/thread.service';
import { ResponsiveService } from '../../../services/responsive.service';
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
import { ChatAreaService } from '../../../services/chat-area.service';
import { ChannelSelectionService } from '../../../services/channel-selection.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-thread-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './thread-header.component.html',
  styleUrl: './thread-header.component.scss',
})
export class ThreadHeaderComponent {
  constructor(
    private threadService: ThreadService,
    private firestore: Firestore,
    public channelSelectionService: ChannelSelectionService,
    public chatAreaService: ChatAreaService
  ) {}
  responsiveService = inject(ResponsiveService);
  allChannels: any = [];
  currentChannelId: any;
  currentChannel: any;

  ngAfterViewInit(): void {
    this.channelSelectionService.getSelectedChannel().subscribe((channel) => {
      this.currentChannelId = channel;
      this.subChannels();
    });
  }

  closeThread() {
    this.threadService.closeThread();
    this.responsiveService.isThreadOpen = false;
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
}
