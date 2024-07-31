import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Message } from '../../../../models/message.class';
import { FormsModule } from '@angular/forms';
import { ChannelSelectionService } from '../../../services/channel-selection.service';
import { FileUploadeService } from '../../../services/file-upload.service';

@Component({
  selector: 'app-channel-message-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './channel-message-input.component.html',
  styleUrl: './channel-message-input.component.scss',
})
export class ChannelMessageInputComponent implements OnInit {
  message = new Message();
  weekday: any;
  year: any;
  month: any;
  day: any;
  hour: any;
  minute: any;
  user: any;
  currentChannel: any;
  selectedFileCache: File | null = null;
  selectectUrlCache: any;
  selectetFileNameCache: any;
  selectedFile: File | null = null;
  selectectUrl: any;
  selectetFileName: any;

  constructor(
    private firestore: Firestore,
    private channelSelectionService: ChannelSelectionService,
    private fileUploadeService: FileUploadeService
  ) {}

  async saveMessage() {
    this.selectedFile = this.selectedFileCache;
    if (this.selectedFile) {
      await this.saveFile();
      this.deleteFile();
      this.addIMG();
    }

    this.updateDateTime();
    setTimeout(() => {}, 100);
    await addDoc(
      collection(this.firestore, 'Channels', this.currentChannel, 'messages'),
      this.toJSON()
    )
      .catch((err) => {
        console.error(err);
      })
      .then((docRef) => {});
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
      fileUrl: this.message.fileUrl,
      fileName: this.message.fileName,
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

  addIMG() {
    this.message.fileUrl = this.selectectUrl;
    this.message.fileName = this.selectedFile?.name;
  }

  ngOnInit(): void {
    this.channelSelectionService.getSelectedChannel().subscribe((channel) => {
      this.currentChannel = channel;
    });
  }

  onFileSelected(event: any) {
    if (this.selectectUrlCache) {
      this.deleteFile();
    }
    this.selectedFileCache = event.target.files[0];
    this.saveFileToCache();
  }

  async saveFile() {
    console.log(this.selectedFile);

    if (this.selectedFile) {
      const imageUrl = await this.fileUploadeService.uploadFile(
        this.selectedFile
      );
      console.log(imageUrl);
      this.selectetFileName = this.selectedFile;
      this.selectectUrl = imageUrl;
    } else {
      console.error('No file selected');
    }
  }

  async saveFileToCache() {
    if (this.selectedFileCache) {
      const imageUrl = await this.fileUploadeService.uploadFileToCache(
        this.selectedFileCache
      );
      this.selectetFileNameCache = this.selectedFileCache;
      this.selectectUrlCache = imageUrl;
    } else {
      console.error('No file selected');
    }
  }

  deleteFile() {
    this.selectectUrlCache = null;
    let name = this.selectetFileNameCache.name;
    console.log(this.selectetFileNameCache.name);
    this.fileUploadeService.deleteCachedFile(name!);
  }
}
