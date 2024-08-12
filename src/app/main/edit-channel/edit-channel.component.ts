import { Component, OnInit } from '@angular/core';
import { EditChannelService } from '../../services/edit-channel.service';
import {
  Firestore,
  collection,
  limit,
  onSnapshot,
  query,
} from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.scss',
})
export class EditChannelComponent implements OnInit {
  currentChannel: any;
  channel: any;
  selectetChannelData: any;

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
        this.channel.push(this.setNoteObject(element.data(), element.id));
      });
      this.getSelectedChannel();
    });
  }

  setNoteObject(obj: any, id: string) {
    return {
      description: obj.description || '',
      images: obj.images || '',
      name: obj.name || '',
      users: obj.users || '',
    };
  }

  getSelectedChannel() {
    for (let i = 0; i < this.channel.length; i++) {
      const element = this.channel[i];
      if (element.name == this.currentChannel) {
        this.selectetChannelData = element;
        console.log(this.selectetChannelData);
      }
    }
  }
}