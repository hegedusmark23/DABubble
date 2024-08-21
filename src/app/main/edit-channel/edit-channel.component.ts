import { Component, inject, OnInit } from '@angular/core';
import { EditChannelService } from '../../services/edit-channel.service';
import {
  Firestore,
  collection,
  doc,
  limit,
  onSnapshot,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../services/sidebar.service'; 
import { FormsModule } from '@angular/forms';

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
  channelInfo = inject(SidebarService);

  constructor(
    public editChannelService: EditChannelService, // Füge den Service hier hinzu
    private firestore: Firestore
  ) {}
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

  abandon() {
    alert('channel verlassen');
  }

  editChannelName(){
    this.editChannelNameOpen = true;
  }

  editChannelDescription(){
    this.editChannelDescriptionOpen = true;
  }

  async saveChannelName() {
    // Überprüfen, ob this.channelName korrekt gesetzt ist
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

        // Stelle sicher, dass this.channelName nach der Aktualisierung auf einen leeren String gesetzt wird
        this.channelName = ''; 

        // Aktualisieren der Channels und Benutzerinformationen
        this.channelInfo.fetchChannels();
        this.channelInfo.fetchUsers();
    } catch (err) {
        console.error('Error updating channel name: ', err);
    }
}

toJSON() {
    return {
        name: this.channelName
    };
}


  saveChannelDescription(){
    this.editChannelDescriptionOpen = false;
  }
}
