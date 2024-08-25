import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  addDoc,
  collection,
  Firestore,
  limit,
  onSnapshot,
  query,
} from '@angular/fire/firestore';
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

  currentChannelId: any;
  currentChannel: any;
  selectedFile: File | null = null;
  FileUrl: any;
  emojiSelector: any = false;
  authService = inject(AuthService);
  allUser: any;
  allUids: any;

  userSearch: any;

  tagUserSelector: boolean = false;
  tagedUser: any = [];
  lastAtPosition: number | null = null;

  @ViewChild('messageTextarea') messageTextarea: any;

  constructor(
    private firestore: Firestore,
    private channelSelectionService: ChannelSelectionService,
    private fileUploadeService: FileUploadeService
  ) {}

  //speichert wercher channel gerade ausgewählt ist
  ngOnInit(): void {
    this.channelSelectionService.getSelectedChannel().subscribe((channel) => {
      this.currentChannelId = channel;
      this.subUser();
      this.subChannels();
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

  async saveMessage(event: any) {
    event?.preventDefault();
    // Finde das 'contenteditable' Div Element
    const messageTextarea = document.querySelector('.textArea') as HTMLElement;

    if (messageTextarea) {
      // Setze den aktuellen Inhalt des Divs in die message.message Variable
      this.message.message = messageTextarea.innerText || ''; // oder textContent
    }

    // Überprüfe, ob eine Datei ausgewählt ist und speichere sie
    if (this.selectedFile) {
      await this.saveFile();
      this.addIMG();
      this.deleteFile();
    }

    // Aktualisiere die Zeit
    this.updateDateTime();

    // Speichere die Nachricht in der Firestore-Datenbank
    await addDoc(
      collection(this.firestore, 'Channels', this.currentChannelId, 'messages'),
      this.toJSON()
    ).catch((err) => {
      console.error(err);
    });

    // Leere das message.message Feld und den Inhalt des contenteditable Divs
    this.message.message = '';
    if (messageTextarea) {
      messageTextarea.innerText = ''; // oder textContent = '';
    }
  }

  //wenn ein bild ausgewählt ist wird diese ins storage hochgeladen und dessen url in der variable FileUrl gespeichert
  async saveFile() {
    if (this.selectedFile) {
      const imageUrl = await this.fileUploadeService.uploadFile(
        this.selectedFile,
        'messangeImages'
      );
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
      threadCount: this.message.threadCount,
      thumbsUp: this.message.thumbsUp,
      thumbsDown: this.message.thumbsDown,
      rocket: this.message.rocket,
      nerdFace: this.message.nerdFace,
      noted: this.message.noted,
      shushingFace: this.message.shushingFace,
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

  insertTag(uid: any) {
    const textarea: HTMLTextAreaElement = this.messageTextarea.nativeElement;

    // Aktuelle Position des Cursors
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;

    // Wert des Textarea-Felds aktualisieren
    this.message.message =
      textarea.value.substring(0, startPos) +
      uid +
      textarea.value.substring(endPos, textarea.value.length);

    // Cursor-Position nach dem Einfügen des Textes setzen
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = startPos + uid.length;
    }, 0);
  }

  addEmoji($event: any) {
    let element = $event;
    this.insertEmoji(element['emoji'].native);
  }

  openEmojiSelector() {
    this.emojiSelector = !this.emojiSelector;
  }

  subUser() {
    const q = query(collection(this.firestore, 'Users'), limit(1000));
    onSnapshot(q, (list) => {
      this.allUser = [];
      list.forEach((element) => {
        this.allUser.push(this.setNoteObjectUser(element.data(), element.id));
      });
    });
  }
  setNoteObjectUser(obj: any, id: string) {
    return {
      email: obj.email || '',
      image: obj.image || '',
      name: obj.name || '',
      uid: obj.uid || '',
    };
  }

  subChannels() {
    const q = query(collection(this.firestore, 'Channels'), limit(1000));
    onSnapshot(q, (list) => {
      let channel: any;
      list.forEach((element) => {
        channel = this.setNoteChannel(element.data(), element.id);

        if (channel.id == this.currentChannelId) {
          this.currentChannel = channel;
          this.allUids = this.currentChannel.uids;
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
      uids: obj.uids || '',
    };
  }

  getUser(uid: any) {
    for (let i = 0; i < this.allUser.length; i++) {
      const element = this.allUser[i];
      if (element.uid === uid) {
        return element;
      }
    }
  }

  clearTagUser() {
    // Versuche, das Eingabeelement über die ID zu bekommen
    const inputElement = document.getElementById('input') as HTMLElement;

    // Prüfe, ob das Element existiert
    if (!inputElement) {
      console.error('Das Eingabeelement wurde nicht gefunden.');
      return;
    }

    // Finde das letzte @-Zeichen im gesamten Inhalt (inklusive Text und Span-Elementen)
    let atIndex = -1;
    let currentIndex = 0;

    inputElement.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const nodeText = node.textContent || '';
        const localAtIndex = nodeText.lastIndexOf('@');
        if (localAtIndex !== -1) {
          atIndex = currentIndex + localAtIndex;
        }
        currentIndex += nodeText.length;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        currentIndex += (node as HTMLElement).innerText.length;
      }
    });

    if (atIndex !== -1) {
      this.lastAtPosition = atIndex + 1;

      // Setze den Cursor nach dem @-Zeichen
      const range = document.createRange();
      const selection = window.getSelection();

      let nodeIndex = 0;
      let found = false;

      inputElement.childNodes.forEach((node) => {
        if (found) return;

        if (node.nodeType === Node.TEXT_NODE) {
          if (nodeIndex + node.textContent!.length >= this.lastAtPosition!) {
            range.setStart(node, this.lastAtPosition! - nodeIndex);
            range.collapse(true);
            found = true;
          }
          nodeIndex += node.textContent!.length;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          nodeIndex += (node as HTMLElement).innerText.length;
        }
      });

      if (found) {
        selection!.removeAllRanges();
        selection!.addRange(range);
      }

      this.tagUserSelector = false;
    } else {
      console.log('Kein @-Zeichen gefunden.');
    }
  }

  addTagUser(tag: string) {
    // Versuche, das Eingabeelement über die ID zu bekommen
    const inputElement = document.getElementById('input') as HTMLElement;

    // Prüfe, ob das Element existiert und die letzte Position des @-Zeichens bekannt ist
    if (!inputElement || this.lastAtPosition === null) {
      console.error(
        'Das Eingabeelement wurde nicht gefunden oder die Position des @-Zeichens ist unbekannt.'
      );
      return;
    }

    let nodeIndex = 0;
    let found = false;

    inputElement.childNodes.forEach((node) => {
      if (found) return;

      if (node.nodeType === Node.TEXT_NODE) {
        if (nodeIndex + node.textContent!.length >= this.lastAtPosition!) {
          // Teile den Textknoten an der Stelle des @-Zeichens
          const textBeforeAt = node.textContent!.substring(
            0,
            this.lastAtPosition! - 1
          );
          const textAfterAt = node.textContent!.substring(this.lastAtPosition!);

          const span = document.createElement('span');
          span.className = 'highlight';
          span.textContent = '@' + tag;
          span.contentEditable = 'false';

          const afterSpanText = document.createTextNode(textAfterAt);

          // Ersetze den Textknoten mit dem neuen Inhalt
          const parent = node.parentNode!;
          parent.replaceChild(afterSpanText, node);
          parent.insertBefore(span, afterSpanText);
          parent.insertBefore(document.createTextNode(textBeforeAt), span);

          found = true;
        }
        nodeIndex += node.textContent!.length;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        nodeIndex += (node as HTMLElement).innerText.length;
      }
    });

    // Setze den Cursor nach dem eingefügten Tag
    const range = document.createRange();
    const selection = window.getSelection();

    const lastTextNode =
      inputElement.childNodes[inputElement.childNodes.length - 1];
    range.setStartAfter(lastTextNode);
    range.collapse(true);
    selection!.removeAllRanges();
    selection!.addRange(range);

    // Reset der Position des @-Zeichens und des Tag-Selectors
    this.lastAtPosition = null;
    this.tagUserSelector = false;
  }

  onMessageChange(event: any) {}

  onKeyDown(event: KeyboardEvent) {
    const inputElement = event.target as HTMLElement;

    setTimeout(() => {
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);

      // Berechne die tatsächliche Cursor-Position über den gesamten Textinhalt
      let cursorPosition = 0;
      const iterator = document.createNodeIterator(
        inputElement,
        NodeFilter.SHOW_TEXT,
        null
      );
      let currentNode;
      let foundCursor = false;

      while ((currentNode = iterator.nextNode()) && !foundCursor) {
        if (currentNode === range?.startContainer) {
          cursorPosition += range.startOffset;
          foundCursor = true;
        } else {
          cursorPosition += currentNode.textContent?.length || 0;
        }
      }

      // Debugging: Originaler Text im Input-Element
      const originalText = inputElement.textContent || '';
      console.log('Original Text:', originalText);

      // Text ohne Spans
      const text = this.getTextWithoutSpans(inputElement) || '';
      console.log('Text ohne Spans:', text);

      // Überprüfe berechnete Cursor-Position
      console.log('Berechnete Cursor Position:', cursorPosition);

      // Finde das letzte @-Zeichen vor dem Cursor
      let atIndex = text.lastIndexOf('@', cursorPosition - 1);
      console.log('Index of last @:', atIndex);

      if (atIndex !== -1) {
        let textAfterAt = text.substring(atIndex + 1, cursorPosition);
        console.log('Text after @:', textAfterAt);
        const spaceIndex = textAfterAt.search(/\s/);

        const isCursorInMentionArea =
          cursorPosition > atIndex &&
          (spaceIndex === -1 || cursorPosition <= atIndex + textAfterAt.length);

        if (isCursorInMentionArea) {
          this.userSearch = textAfterAt.toLowerCase();
          this.tagUserSelector = true;
        } else {
          this.tagUserSelector = false;
        }

        this.allUids = [];
        for (let i = 0; i < this.currentChannel.uids.length; i++) {
          const element = this.currentChannel.uids[i];
          const userName = this.getUser(element).name.toLowerCase();
          if (userName.includes(this.userSearch)) {
            this.allUids.push(element);
          }
        }

        console.log('Text after @:', textAfterAt);
      } else {
        this.tagUserSelector = false;
      }
    }, 0);
  }

  getTextWithoutSpans(element: HTMLElement): string {
    let text = '';
    element.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent || '';
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        if (el.tagName !== 'SPAN') {
          text += this.getTextWithoutSpans(el);
        }
      }
    });
    return text;
  }
}
