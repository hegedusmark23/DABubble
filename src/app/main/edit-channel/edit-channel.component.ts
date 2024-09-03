import { Component, inject, OnInit } from '@angular/core';
import { EditChannelService } from '../../services/edit-channel.service';
import {
  Firestore,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../services/sidebar.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ChannelSelectionService } from '../../services/channel-selection.service';
import { ThreadService } from '../../services/thread.service';

@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.scss',
})
export class EditChannelComponent implements OnInit {
  currentChannel: any;
  channel: any;
  selectetChannelData: any;
  editChannelNameOpen = false;
  editChannelDescriptionOpen = false;
  channelName = '';
  channelDescription = '';
  channelInfo = inject(SidebarService);
  authService = inject(AuthService);

  constructor(
    public editChannelService: EditChannelService, // Füge den Service hier hinzu
    private firestore: Firestore,
    private channelSelectionService: ChannelSelectionService,
    private threadService: ThreadService,
  ) { }
  ngOnInit(): void {
    this.currentChannel = this.editChannelService.getOpenChannel();
    this.subMessages();
  }

  subMessages() {
    const q = query(collection(this.firestore, 'Channels'), limit(1000));
    onSnapshot(q, (list) => {
      this.channel = [];
      list.forEach((element) => {
        this.channel.push(this.setNoteChannel(element.data(), element.id));
      });
      this.getSelectedChannel();
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

  getSelectedChannel() {
    for (let i = 0; i < this.channel.length; i++) {
      const element = this.channel[i];
      if (element.id == this.currentChannel) {
        this.selectetChannelData = element;
      }
    }
  }

  isInputValid(): boolean {
    return this.channelName.length >= 3;
  }

  async abandon() {
    const channelsCollection = collection(this.firestore, 'Channels');
    const querySnapshot = await getDocs(channelsCollection);

    querySnapshot.forEach(async (docSnapshot) => {
      const channelData = docSnapshot.data();

      if (channelData['id'] === this.selectetChannelData.id) {
        const userNumber = channelData['uids'].indexOf(this.authService.currentUserSignal()?.uId);

        if (userNumber > -1) {
          channelData['uids'].splice(userNumber, 1);
          channelData['emails'].splice(userNumber, 1);
          channelData['images'].splice(userNumber, 1);
          channelData['users'].splice(userNumber, 1);

          const channelDocRef = doc(this.firestore, 'Channels', docSnapshot.id);
          await updateDoc(channelDocRef, {
            uids: channelData['uids'],
            emails: channelData['emails'],
            images: channelData['images'],
            users: channelData['users']
          });
          this.openTheNextChannel()
          this.editChannelService.setEditChannel(false,null);
          this.threadService.closeThread();
          this.channelSelectionService.openChannel();
          this.channelSelectionService.setSelectedChannel(
          this.channelInfo.AllChannelsIds[this.channelInfo.currentChannelNumber]
      );
          this.channelInfo.fetchChannels;
          this.channelInfo.fetchUsers;
          this.channelInfo.currentChannelNumber = +1
        }else{
          alert('du bist kein mitglied');
        }
      }
    });
  }

  openTheNextChannel() {
    if (this.channelInfo.currentChannelNumber < this.channelInfo.AllChannelsIds.length - 1) {
      this.channelInfo.currentChannelNumber = this.channelInfo.currentChannelNumber + 1;
    } else {
      this.channelInfo.currentChannelNumber = this.channelInfo.AllChannelsIds.length - 1;
    }
  }

  editChannelName() {
    this.editChannelNameOpen = true;
  }

  editChannelDescription() {
    this.editChannelDescriptionOpen = true;
  }

  async saveChannelName() {
    if (!this.channelName) {
      console.error('Channel name is empty. Please provide a valid name.');
      return;
    }
    const channelRef = doc(
      collection(this.firestore, 'Channels'),
      this.currentChannel
    );
    try {
      await updateDoc(channelRef, this.toJSON());
      console.log('Channel name updated successfully');
      this.channelName = '';
      this.editChannelNameOpen = false;
      this.threadService.closeThread();
      this.channelSelectionService.openChannel();
      this.channelSelectionService.setSelectedChannel(
      this.channelInfo.AllChannelsIds[this.channelInfo.currentChannelNumber]
      );
    } catch (err) {
      console.error('Error updating channel name: ', err);
    }
  }

  toJSON() {
    return {
      name: this.channelName
    };
  }


  async saveChannelDescription() {
    if (!this.channelDescription) {
      console.error('Channel name is empty. Please provide a valid description.');
      return;
    }
    const channelRef = doc(
      collection(this.firestore, 'Channels'),
      this.currentChannel
    );
    try {
      await updateDoc(channelRef, this.toJSONDescription());
      console.log('Channel name updated successfully');
      this.channelDescription = '';
      this.editChannelDescriptionOpen = false;
      this.threadService.closeThread();
      this.channelSelectionService.openChannel();
      this.channelSelectionService.setSelectedChannel(
      this.channelInfo.AllChannelsIds[this.channelInfo.currentChannelNumber]
      );
    } catch (err) {
      console.error('Error updating channel name: ', err);
    }
  }

  toJSONDescription() {
    return {
      description: this.channelDescription
    };
  }
}
