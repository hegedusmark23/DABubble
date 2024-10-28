import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  limit,
  onSnapshot,
  query,
  setDoc,
} from '@angular/fire/firestore';
import { Message } from '../../../../models/message.class';
import { FormsModule } from '@angular/forms';
import { ChannelSelectionService } from '../../../services/channel-selection.service';
import { FileUploadeService } from '../../../services/file-upload.service';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { AuthService } from '../../../services/auth.service';
import { SidebarService } from '../../../services/sidebar.service';
import { DirectMessageSelectionService } from '../../../services/direct-message-selection.service';

@Component({
  selector: 'app-direct-messages-message-input',
  standalone: true,
  imports: [CommonModule, FormsModule, PickerComponent],
  templateUrl: './direct-messages-message-input.component.html',
  styleUrls: [
    './direct-messages-message-input.component.scss',
    './direct-messages-message-input.component.responsive.scss',
  ],
})
export class DirectMessagesMessageInputComponent implements OnInit {
  @Component({
    selector: 'app-channel-message-input',
    standalone: true,
    imports: [CommonModule, FormsModule, PickerComponent],
    templateUrl: './channel-message-input.component.html',
    styleUrls: [
      './channel-message-input.component.scss',
      './channel-message-input.component.responsive.scss',
    ],
  })
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
  allChannel: any = [];
  allChannelArray: any = [];

  openUser: any;
  userSearch: any;
  channelSearch: any;

  tagUserSelector: boolean = false;
  tagChannelSelector: boolean = false;

  tagedUser: any = [];
  tagedChannel: any = [];
  lastAtPosition: number | null = null;
  showPlaceholder: boolean = true;

  allowMessageSend: boolean = false;
  @ViewChild('textAreaDirectMessage') messageTextarea: any;
  channelInfo = inject(SidebarService);
  sidebarService = inject(SidebarService);

  constructor(
    private firestore: Firestore,
    private channelSelectionService: ChannelSelectionService,
    private fileUploadeService: FileUploadeService,
    public directMessageSelectionService: DirectMessageSelectionService
  ) {}

  //speichert wercher channel gerade ausgewählt ist
  ngOnInit(): void {
    this.channelSelectionService.getSelectedChannel().subscribe((channel) => {
      this.currentChannelId = channel;
      this.subUser();
      this.subChannels();
      this.setOpenUser();
    });
  }

  ngAfterViewInit(): void {
    this.channelSelectionService.getSelectedChannel().subscribe((channel) => {
      this.clearInput();
    });
  }

  setOpenUser() {
    this.directMessageSelectionService
      .getSelectedChannel()
      .subscribe((value) => {
        this.openUser = value;
      });
  }

  clearInput() {
    if (typeof document !== 'undefined') {
      const div = document.getElementById('input');

      if (div) {
        const childNodes = Array.from(div.childNodes); // Erstelle eine Kopie der Knoten
        for (const node of childNodes) {
          if (node.nodeType === Node.TEXT_NODE) {
            node.nodeValue = ''; // Textknoten leeren
          } else if (node.nodeName === 'SPAN') {
            node.remove(); // Entferne span-Element
          }
        }

        // Entferne den Fokus vom input-div
        (div as HTMLElement).blur();

        this.showPlaceholder = true;
      }
    }
  }

  removePlaceholder() {
    this.showPlaceholder = false;
  }

  restorePlaceholder() {
    if (this.messageTextarea.nativeElement.innerText.trim() !== '') {
    } else {
      this.showPlaceholder = true;
    }
  }

  //speichert die bilder in den cache
  async saveFileToCache() {
    if (this.selectedFile) {
      this.allowMessageSend = true;
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
    this.allowMessageSend = false;
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
    let messageId = '';
    this.user = this.authService.currentUserSignal()?.uId;

    event?.preventDefault();
    this.tagUserSelector = false;

    // Finde das 'contenteditable' Div Element
    const messageTextarea = document.querySelector(
      '.textAreaDirectMessage'
    ) as HTMLElement;

    if (messageTextarea) {
      const children = messageTextarea.childNodes;
      let result = '';

      children.forEach((child) => {
        if (
          child.nodeType === Node.ELEMENT_NODE &&
          (child as HTMLElement).tagName === 'SPAN'
        ) {
          const uid = (child as HTMLElement).getAttribute('data-uid');
          if (uid) {
            const firstChar = (child as HTMLElement).innerHTML.charAt(0);
            if (firstChar === '@') {
              result += `₿ЯæŶ∆Ωг${uid} `;
            } else if (firstChar === '#') {
              result += `₣Ж◊ŦΨø℧${uid} `;
            } else {
              result += `${uid} `;
            }
          }
        } else if (child.nodeType === Node.TEXT_NODE) {
          result += child.textContent;
        }
      });

      this.message.message = result.trim();
    }

    if (this.message.message.length < 1 && !this.selectedFile) {
      return;
    }

    if (this.selectedFile) {
      await this.saveFile();
      this.addIMG();
      this.deleteFile();
    }

    this.updateDateTime();

    // Speichere die Nachricht für den Sender
    const messageRef = doc(
      collection(this.firestore, 'direcmessages', this.user, this.openUser)
    );
    messageId = messageRef.id;

    await setDoc(messageRef, this.toJSON())
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });

    // Speichere die Nachricht für den Empfänger mit der gleichen ID
    const recipientRef = doc(
      this.firestore,
      'direcmessages',
      this.openUser,
      this.user,
      messageId
    );

    await setDoc(recipientRef, this.toJSON())
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });

    // Leere das Input-Feld
    this.clearInput();
    this.tagUserSelector = false;
    this.tagChannelSelector = false;
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
  }

  insertEmoji(emoji: any) {
    // Holen Sie sich das referenzierte `div`-Element
    const textarea = this.messageTextarea.nativeElement;

    // Stellen Sie sicher, dass das `div` den Fokus hat
    textarea.focus();

    // Aktuelle Selektion erhalten
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      console.error('Keine gültige Selektion gefunden.');
      return;
    }

    // Den aktuellen Range (Bereich) erhalten
    const range = selection.getRangeAt(0);

    // Sicherstellen, dass der Range im `textarea` liegt
    const commonAncestor = range.commonAncestorContainer;
    if (!textarea.contains(commonAncestor)) {
      console.error('Selektion liegt außerhalb des `textarea`.');
      return;
    }

    // Emoji Text extrahieren
    const emojiText = emoji.native || emoji.emoji || emoji;
    if (!emojiText) {
      console.error('Kein gültiger Emoji-Text gefunden.');
      return;
    }

    // Emoji als Textnode erstellen
    const textNode = document.createTextNode(emojiText);

    // Range auf das Ende des Inhalts setzen
    range.selectNodeContents(textarea); // Wählt den gesamten Inhalt des `div`
    range.collapse(false); // Verschiebt den Cursor ans Ende

    // Textnode am Ende des Inhalts einfügen
    range.insertNode(textNode);

    // Den Cursor direkt nach dem eingefügten Emoji setzen
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);

    // Selektion aktualisieren
    selection.removeAllRanges();
    selection.addRange(range);

    // Scroll position anpassen (optional, falls benötigt)
    textarea.scrollTop = textarea.scrollHeight;
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
      this.allChannel = [];
      let channel: any;
      list.forEach((element) => {
        channel = this.setNoteChannel(element.data(), element.id);
        this.allChannel.push(channel);

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
    this.clearTag('@');
  }

  addTagUser(userName: string, uid: any) {
    this.addTag('@', userName, uid, this.openUserProfil);
  }

  clearTagChannel() {
    this.clearTag('#');
  }

  addTagChannel(channelName: string, uid: any) {
    this.addTag('#', channelName, uid, this.openChannel);
  }

  clearTag(tagSymbol: string) {
    const inputElement = document.getElementById('input') as HTMLElement;

    if (!inputElement) {
      console.error('Das Eingabeelement wurde nicht gefunden.');
      return;
    }

    let atIndex = -1;
    let currentIndex = 0;

    inputElement.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const nodeText = node.textContent || '';
        const localAtIndex = nodeText.lastIndexOf(tagSymbol); // `@` or `#`
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

      let found = false;
      currentIndex = 0;

      inputElement.childNodes.forEach((node) => {
        if (found) return;

        if (node.nodeType === Node.TEXT_NODE) {
          const nodeText = node.textContent || '';
          if (currentIndex + nodeText.length >= this.lastAtPosition!) {
            const indexInNode = this.lastAtPosition! - currentIndex;

            node.textContent = nodeText.substring(0, indexInNode);
            found = true;
          }
          currentIndex += nodeText.length;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          currentIndex += (node as HTMLElement).innerText.length;
        }
      });

      const range = document.createRange();
      const selection = window.getSelection();
      let lastTextNode =
        inputElement.childNodes[inputElement.childNodes.length - 1];

      if (lastTextNode.nodeType !== Node.TEXT_NODE) {
        lastTextNode = document.createTextNode('');
        inputElement.appendChild(lastTextNode);
      }

      range.setStart(lastTextNode, lastTextNode.textContent!.length);
      range.collapse(true);
      selection!.removeAllRanges();
      selection!.addRange(range);

      if (tagSymbol == '#') {
        this.tagChannelSelector = false;
      } else {
        this.tagUserSelector = false;
      }
    } else {
    }
  }

  addTag(
    tagSymbol: string,
    tag: string,
    uid: any,
    openFunction: (uid: any) => void
  ) {
    const inputElement = document.getElementById('input') as HTMLElement;

    if (!inputElement || this.lastAtPosition === null) {
      console.error(
        'Das Eingabeelement wurde nicht gefunden oder die Position des Symbols ist unbekannt.'
      );
      return;
    }

    let nodeIndex = 0;
    let found = false;

    inputElement.childNodes.forEach((node) => {
      if (found) return;

      if (node.nodeType === Node.TEXT_NODE) {
        const textContent = node.textContent || '';
        const atPositionInNode = this.lastAtPosition! - 1 - nodeIndex;

        if (nodeIndex + textContent.length >= this.lastAtPosition!) {
          const textBeforeAt = textContent.substring(0, atPositionInNode);
          const textAfterAt = textContent.substring(
            this.lastAtPosition! - nodeIndex
          );

          const span = document.createElement('span');
          span.className = 'tagHighlightInput';
          span.textContent = tagSymbol + tag;
          span.contentEditable = 'false';
          span.setAttribute('data-uid', uid);
          span.addEventListener('click', () => openFunction(uid));

          const afterSpanText = document.createTextNode(textAfterAt);
          const parent = node.parentNode!;

          const beforeSpanText = document.createTextNode(
            textBeforeAt || '\u200B'
          );
          const afterSpanPlaceholder = document.createTextNode('\u200B');

          parent.replaceChild(afterSpanText, node);
          parent.insertBefore(span, afterSpanText);
          parent.insertBefore(beforeSpanText, span);
          parent.insertBefore(afterSpanPlaceholder, afterSpanText);

          span.addEventListener('keydown', function (event) {
            if (event.key === 'Backspace' || event.key === 'Delete') {
              if (
                event.key === 'Backspace' &&
                beforeSpanText.textContent === '\u200B'
              ) {
                parent.removeChild(span);
                event.preventDefault();
              }
              if (
                event.key === 'Delete' &&
                afterSpanPlaceholder.textContent === '\u200B'
              ) {
                parent.removeChild(span);
                event.preventDefault();
              }
            }
          });

          found = true;
        }
        nodeIndex += textContent.length;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        nodeIndex += (node as HTMLElement).innerText.length;
      }
    });

    const range = document.createRange();
    const selection = window.getSelection();
    const lastTextNode =
      inputElement.childNodes[inputElement.childNodes.length - 1];

    range.setStartAfter(lastTextNode);
    range.collapse(true);
    selection!.removeAllRanges();
    selection!.addRange(range);

    this.lastAtPosition = null;
    this.tagChannelSelector = false;
    this.tagUserSelector = false;
  }

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

      if (originalText.length > 0) {
        this.allowMessageSend = true;
      } else {
        this.allowMessageSend = false;
      }

      // Text ohne Spans
      const text = this.getTextWithoutSpans(inputElement) || '';

      // Finde das letzte @- oder #-Zeichen vor dem Cursor
      let atIndex = text.lastIndexOf('@', cursorPosition - 1);
      let hashIndex = text.lastIndexOf('#', cursorPosition - 1);

      // Funktion zum Verarbeiten von Erwähnungen (@) und Kanälen (#)
      const processTag = (index: number, type: 'user' | 'channel') => {
        let textAfterTag = text.substring(index + 1, cursorPosition);
        const spaceIndex = textAfterTag.search(/\s/);

        const isCursorInTagArea =
          cursorPosition > index &&
          (spaceIndex === -1 || cursorPosition <= index + textAfterTag.length);

        if (isCursorInTagArea) {
          const searchTerm = textAfterTag.toLowerCase();

          if (type === 'user') {
            this.userSearch = searchTerm;
            this.tagUserSelector = true;
            this.tagChannelSelector = false;
            // Suche nach passenden Benutzern
            this.allUids = [];
            for (let i = 0; i < this.currentChannel.uids.length; i++) {
              const element = this.currentChannel.uids[i];
              const userName = this.getUser(element).name.toLowerCase();
              if (userName.includes(this.userSearch)) {
                this.allUids.push(element);
              }
            }
          } else if (type === 'channel') {
            this.channelSearch = searchTerm;
            this.tagChannelSelector = true;
            this.tagUserSelector = false;
            // Suche nach passenden Kanälen
            this.allChannelArray = [];
            for (let i = 0; i < this.allChannel.length; i++) {
              const channel = this.allChannel[i];
              const channelName = channel.name.toLowerCase();
              if (channelName.includes(this.channelSearch)) {
                this.allChannelArray.push(channel);
              }
            }
          }
        } else {
          if (type === 'user') {
            this.tagUserSelector = false;
          } else if (type === 'channel') {
            this.tagChannelSelector = false;
          }
        }
      };

      // Prüfe, ob der Cursor in einem @- oder #-Bereich ist
      if (atIndex !== -1 && (hashIndex === -1 || atIndex > hashIndex)) {
        processTag(atIndex, 'user');
      } else if (hashIndex !== -1) {
        processTag(hashIndex, 'channel');
      } else {
        this.tagUserSelector = false;
        this.tagChannelSelector = false;
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

  openTag() {
    const inputElement = document.getElementById('input') as HTMLElement;

    if (!inputElement) {
      console.error('Das Eingabeelement wurde nicht gefunden.');
      return;
    }

    // Überprüfen, ob das letzte Zeichen ein @ ist
    const lastChild =
      inputElement.childNodes[inputElement.childNodes.length - 1];
    if (lastChild && lastChild.nodeType === Node.TEXT_NODE) {
      if (lastChild.textContent!.endsWith('@')) {
        // @-Zeichen entfernen
        lastChild.textContent = lastChild.textContent!.slice(0, -1);

        // Optional: Wenn kein Text mehr vorhanden ist, den leeren Textknoten entfernen
        if (lastChild.textContent === '') {
          inputElement.removeChild(lastChild);
        }

        // Tag User Selector deaktivieren
        this.tagUserSelector = false;
      } else {
        // @-Zeichen hinzufügen
        lastChild.textContent += '@';
        this.tagUserSelector = true;
        this.triggerAtKeyDown(inputElement); // onKeyDown für @ ausführen
      }
    } else {
      // Neues @-Zeichen hinzufügen, wenn kein letzter Textknoten existiert
      const atSymbol = document.createTextNode('@');
      inputElement.appendChild(atSymbol);
      this.tagUserSelector = true;
      this.triggerAtKeyDown(inputElement); // onKeyDown für @ ausführen
    }

    // Cursor nach dem @-Zeichen setzen, wenn hinzugefügt
    if (this.tagUserSelector) {
      const range = document.createRange();
      const selection = window.getSelection();

      range.setStartAfter(
        inputElement.childNodes[inputElement.childNodes.length - 1]
      );
      range.collapse(true);

      selection!.removeAllRanges();
      selection!.addRange(range);

      // Optional: Die Position des @-Zeichens für die Funktion addTagUser speichern
      this.lastAtPosition = inputElement.innerText.length;
    }
  }

  triggerAtKeyDown(inputElement: HTMLElement) {
    // Erstelle ein keydown-Event für das @-Zeichen
    const event = new KeyboardEvent('keydown', {
      key: '@',
      code: 'Digit2', // Standardmäßig das @-Zeichen auf QWERTZ-Tastaturen
      keyCode: 50, // KeyCode für 2/@
      charCode: 64, // charCode für @
      bubbles: true, // Event kann nach oben "blubbern"
      cancelable: true, // Event kann abgebrochen werden
    });

    // Manuell die onKeyDown Funktion auslösen
    inputElement.dispatchEvent(event);
  }

  openUserProfil(uid: any) {
    this.channelInfo.userProfilOpen = true;
    this.channelInfo.activeUserProfil = 0;
    this.channelInfo.activeUser = this.getUser(uid).name;
    this.channelInfo.activeEmail = this.getUser(uid).email;
    this.channelInfo.activeImage = this.getUser(uid).image;
    this.channelInfo.activeUid = uid;
  }

  openChannel(uid: any) {
    this.channelSelectionService.openChannel();
    this.channelSelectionService.setSelectedChannel(uid);
  }

  log(channel: any) {
    return channel;
  }
}
