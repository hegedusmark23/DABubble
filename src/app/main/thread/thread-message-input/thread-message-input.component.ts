import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Message } from '../../../../models/message.class';
import { FormsModule } from '@angular/forms';
import { ChannelSelectionService } from '../../../services/channel-selection.service';

@Component({
  selector: 'app-thread-message-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './thread-message-input.component.html',
  styleUrl: './thread-message-input.component.scss',
})
export class ThreadMessageInputComponent implements OnInit {
  @Input() threadId: any;
  message = new Message();
  currentChannel: any;

  constructor(
    private firestore: Firestore,
    private channelSelectionService: ChannelSelectionService
  ) {}

  async saveMessage() {
    this.updateDateTime();
    setTimeout(() => {}, 100);

    await addDoc(
      collection(
        this.firestore,
        'Channels',
        this.currentChannel,
        'messages',
        this.threadId,
        'thread'
      ),
      this.toJSON()
    )
      .catch((err) => {
        console.error(err);
      })
      .then((docRef) => {
      });

    this.message.message = '';
  }

  toJSON() {
    return {
      id: this.message.id,
      message: this.message.message,
      weekday: this.message.weekday,
      year: this.message.year,
      month: this.message.month,
      day: this.message.day,
      hour: this.message.hour,
      minute: this.message.minute,
      seconds: this.message.seconds,
      milliseconds: this.message.milliseconds,
      user: this.message.user,
    };
  }

  updateDateTime(): void {
    const now = new Date();
    this.message.weekday = now.toLocaleDateString('de-DE', { weekday: 'long' });
    this.message.year = now.getFullYear();
    this.message.month = now.getMonth() + 1; // Monate sind nullbasiert
    this.message.day = now.getDate();
    this.message.hour = now.getHours();
    this.message.minute = now.getMinutes();
    this.message.seconds = now.getSeconds();
    this.message.milliseconds = now.getMilliseconds(); // Millisekunden hinzufügen
    this.message.user = 'send';
  }

  ngOnInit(): void {
    this.channelSelectionService.getSelectedChannel().subscribe((channel) => {
      this.currentChannel = channel;
      this.onChannelChange(channel);
    });
  }

  onChannelChange(channel: string): void {
    // Deine Logik hier
  }
}
