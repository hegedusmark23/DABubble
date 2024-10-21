import { Component, inject } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ChannelSelectionService } from '../../services/channel-selection.service';
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
import { ChatAreaService } from '../../services/chat-area.service';

@Component({
  selector: 'app-channel-userlist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './channel-userlist.component.html',
  styleUrls: [
    './channel-userlist.component.scss',
    './channel-userlist-responsive.component.scss',
  ],
})
export class ChannelUserlistComponent {
  channelInfo = inject(SidebarService);
  authService = inject(AuthService);
  currentChannelId: any = '';
  allUser: any = [];
  currentChannel: any;
  user: any;

  constructor(
    public channelSelectionService: ChannelSelectionService,
    private firestore: Firestore,
    public chatAreaService: ChatAreaService
  ) { }
  ngAfterViewInit(): void {
    this.channelSelectionService.getSelectedChannel().subscribe((channel) => {
      this.currentChannelId = channel;
      this.subUser();
      this.subChannels();
    });
  }

  subUser() {
    const q = query(collection(this.firestore, 'Users'), limit(1000));
    onSnapshot(q, (list) => {
      this.allUser = [];
      list.forEach((element) => {
        this.allUser.push(
          this.chatAreaService.setNoteObjectUser(element.data(), element.id)
        );
      });
      this.setOpenUser();
    });
  }

  subChannels() {
    const q = query(collection(this.firestore, 'Channels'), limit(1000));
    onSnapshot(q, (list) => {
      let channel: any;
      list.forEach((element) => {
        channel = this.chatAreaService.setNoteChannel(
          element.data(),
          element.id
        );

        if (channel.id == this.currentChannelId) {
          this.currentChannel = channel;
        }
      });
    });
  }

  getUser(uid: any) {
    for (let i = 0; i < this.allUser.length; i++) {
      const element = this.allUser[i];
      if (element.uid === uid) {
        return element;
      }
    }
    return { name: undefined };
  }

  setOpenUser() {
    this.user = this.authService.currentUserSignal()?.uId;
  }

  closeDialog() {
    this.channelInfo.openUserList = false;
  }

  notCloseDialog(e: any) {
    e.stopPropagation(e);
  }

  addUserToChannel() {
    this.channelInfo.addUserFromHeaderToChannelOpen = true;
    this.closeDialog();
  }

  openUserProfil(i: number) {
    this.channelInfo.userProfilOpen = true;
    this.channelInfo.activeUserProfil = i;
    this.channelInfo.activeUser =
      this.channelInfo.AllChannelsUsers[this.channelInfo.currentChannelNumber][i];
    this.channelInfo.activeEmail =
      this.channelInfo.AllChannelsEmails[this.channelInfo.currentChannelNumber][i];
    this.channelInfo.activeImage =
      this.channelInfo.AllChannelsImages[this.channelInfo.currentChannelNumber][i];
    this.channelInfo.activeUid =
      this.channelInfo.GlobalChannelUids[this.channelInfo.currentChannelNumber][i];
    this.closeDialog();
  }
}
