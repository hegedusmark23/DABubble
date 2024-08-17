import { Component, inject } from '@angular/core';
import { EditChannelComponent } from '../../edit-channel/edit-channel.component';
import { EditChannelService } from '../../../services/edit-channel.service';
import { ChannelSelectionService } from '../../../services/channel-selection.service';
import { SidebarService } from '../../../services/sidebar.service';
import { CommonModule } from '@angular/common';
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

@Component({
  selector: 'app-channel-header',
  standalone: true,
  imports: [EditChannelComponent, CommonModule],
  templateUrl: './channel-header.component.html',
  styleUrl: './channel-header.component.scss',
})
export class ChannelHeaderComponent {
  currentChannelId: any;
  currentChannel: any;
  channelInfo = inject(SidebarService);
  userNumber: number = 0;

  constructor(
    private firestore: Firestore,
    public editChannelService: EditChannelService,
    private channelSelectionService: ChannelSelectionService
  ) {}

  ngOnInit(): void {
    this.channelSelectionService.getSelectedChannel().subscribe((channel) => {
      this.currentChannelId = channel;
      this.subChannels();
    });
  }

  openAddUserToChannel() {
    this.channelInfo.addUserFromHeaderToChannelOpen = true;
  }

  openUserList() {
    this.channelInfo.openUserList = true;
  }

  subChannels() {
    const q = query(collection(this.firestore, 'Channels'), limit(1000));
    onSnapshot(q, (list) => {
      let channel: any;
      list.forEach((element) => {
        channel = this.setNoteChannel(element.data(), element.id);
        if (channel.id === this.currentChannelId) {
          this.currentChannel = channel;
        }
      });
    });
  }

  setNoteChannel(obj: any, id: string) {
    return {
      id: id,
      channelCreator: obj.channelCreator || '',
      description: obj.description || '',
      images: obj.images || '',
      name: obj.name || '',
      users: obj.users || '',
    };
  }
}
