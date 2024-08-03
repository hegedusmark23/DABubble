import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { Message } from '../../../../models/message.class';
import { FormsModule } from '@angular/forms';
import { ChannelSelectionService } from '../../../services/channel-selection.service';
import { FileUploadeService } from '../../../services/file-upload.service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-channel-message-input',
  standalone: true,
  imports: [CommonModule, FormsModule, PickerComponent],
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

  selectedFile: File | null = null;
  FileUrl: any;
  emojiSelector: any = false;
  authService = inject(AuthService);

  @ViewChild('messageTextarea') messageTextarea: any;

  constructor(
    private firestore: Firestore,
    private channelSelectionService: ChannelSelectionService,
    private fileUploadeService: FileUploadeService
  ) {}

  //speichert wercher channel gerade ausgewählt ist
  ngOnInit(): void {
    this.channelSelectionService.getSelectedChannel().subscribe((channel) => {
      this.currentChannel = channel;
    });
  }

  //speichert die bilder in den cache
  async saveFileToCache() {
    if (this.selectedFile) {
      const imageUrl = await this.fileUploadeService.uploadFile(
        this.selectedFile,
        'messangeCache'
      );
      this.FileUrl = imageUrl;
    } else {
      console.error('No file selected');
    }
  }

  //löscht die bilder aus den cache
  deleteFile() {
    let name = this.selectedFile!.name;
    this.fileUploadeService.deleteFile(name!, 'messangeCache');
    this.FileUrl = null;
    this.selectedFile = null;
  }

  //läd die bilder in den cache wenn sie ausgewählt wurde
  onFileSelected(event: any) {
    if (this.FileUrl) {
      this.deleteFile();
    }
    this.selectedFile = event.target.files[0];
    this.saveFileToCache();
  }

  //erstannt eine nachricht
  async saveMessage() {
    if (this.selectedFile) {
      await this.saveFile();
      this.addIMG();
      this.deleteFile();
    }

    this.updateDateTime();
    await addDoc(
      collection(this.firestore, 'Channels', this.currentChannel, 'messages'),
      this.toJSON()
    ).catch((err) => {
      console.error(err);
    });
    this.message.message = '';
  }

  //wenn ein bild ausgewählt ist wird diese ins storage hochgeladen und dessen url in der variable FileUrl gespeichert
  async saveFile() {
    if (this.selectedFile) {
      const imageUrl = await this.fileUploadeService.uploadFile(
        this.selectedFile,
        'messangeImages'
      );
      console.log(imageUrl);
      this.FileUrl = imageUrl;
    }
  }

  //gibt die vorhandenen informationen als JSON zurück
  toJSON() {
    return {
      id: this.message.id,
      uid: this.message.uid,
      message: this.message.message,
      weekday: this.message.weekday,
      year: this.message.year,
      month: this.message.month,
      day: this.message.day,
      hour: this.message.hour,
      minute: this.message.minute,
      seconds: this.message.seconds,
      milliseconds: this.message.milliseconds,
      fileUrl: this.message.fileUrl,
      fileName: this.message.fileName,
    };
  }

  //erstellt die daten der aktuellen zeit
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
    this.message.uid = this.authService.currentUserSignal()?.uId;
  }

  //fügt die restlichen variablen ins model
  addIMG() {
    this.message.fileUrl = this.FileUrl;
    this.message.fileName = this.selectedFile?.name;
  }

  insertEmoji(emoji: any) {
    const textarea: HTMLTextAreaElement = this.messageTextarea.nativeElement;

    // Aktuelle Position des Cursors
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;

    // Wert des Textarea-Felds aktualisieren
    this.message.message =
      textarea.value.substring(0, startPos) +
      emoji +
      textarea.value.substring(endPos, textarea.value.length);

    // Cursor-Position nach dem Einfügen des Textes setzen
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = startPos + emoji.length;
    }, 0);
  }

  addEmoji($event: any) {
    let element = $event;
    this.insertEmoji(element['emoji'].native);
  }

  openEmojiSelector() {
    this.emojiSelector = !this.emojiSelector;
  }
}
