import { inject, Injectable } from '@angular/core';
import { collection, Firestore, getDocs } from '@angular/fire/firestore';
import { ChannelSelectionService } from './channel-selection.service';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  sidebarOpen = false;
  createChannelDialogActive = false;
  AllChannels: string[] = [];
  AllChannelsUsers: string[] = [];
  AllChannelsIds: string[] = [];
  AllChannelsEmails: string[] = [];
  AllChannelsImages: string[] = [];
  AllChannelsUids: string[] = [];
  AllChannelsDescriptions: string[] = [];
  AllChannelsCreators: string[] = [];
  AllUsers: string[] = [];
  AllEmails: string[] = [];
  AllImages: string[] = [];
  AllUids: string[] = [];
  userList: string[] = [];
  imageList: string[] = [];
  uidList: string[] = [];
  emailList: string[] = [];
  popUpOpen = false;
  editProfilOpen = false;
  editProfilContactformOpen = false;
  userProfilOpen = false;
  addUserToChanelOpen = false;
  addUserFromHeaderToChannelOpen = false;
  openUserList = false;
  addAllUsersToChannel = true;
  addSelectedUsersToChannel = false;
  selectedUsers: any[] = [];
  selectedImages: any[] = [];
  selectedUids: any[] = [];
  selectedEmails: any[] = [];
  activeUser = '';
  activeImage = '';
  activeEmail = '';
  activeUid = '';
  currentChannelNumber: number = 0;
  activeUserIndex: number | undefined;

  constructor(
    private firestore: Firestore,
    private channelSelectionService: ChannelSelectionService
  ) {}

  async fetchChannels() {
    this.AllChannels = [];
    this.AllChannelsUsers = [];
    this.AllChannelsEmails = [];
    this.AllChannelsIds = [];
    this.AllChannelsImages = [];
    this.AllChannelsUids = [];
    this.AllChannelsDescriptions = [];
    this.AllChannelsCreators = [];

    const channelsCollection = collection(this.firestore, 'Channels');
    const querySnapshot = await getDocs(channelsCollection);
    querySnapshot.forEach((doc) => {
      const channelData = doc.data();
      this.AllChannels.push(channelData['name']);
      this.AllChannelsUsers.push(channelData['users']);
      this.AllChannelsEmails.push(channelData['emails']);
      this.AllChannelsIds.push(channelData['id']);
      this.AllChannelsUids.push(channelData['uids']);
      this.AllChannelsImages.push(channelData['images']);
      this.AllChannelsDescriptions.push(channelData['description']);
      this.AllChannelsCreators.push(channelData['channelCreator']);
    });
    this.setTopChannel();
  }

  setTopChannel() {
    this.channelSelectionService.setSelectedChannel(this.AllChannelsIds[0]);
  }

  async fetchUsers() {
    this.AllUsers = [];
    this.userList = [];
    this.imageList = [];
    this.uidList = [];
    this.emailList = [];
    const usersCollection = collection(this.firestore, 'Users');
    const querySnapshot = await getDocs(usersCollection);
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      this.AllUsers.push(userData['name']);
      this.AllEmails.push(userData['email']);
      this.AllImages.push(userData['image']);
      this.AllUids.push(userData['uid']);
      this.userList.push(userData['name']);
      this.imageList.push(userData['image']);
      this.uidList.push(userData['uid']);
      this.emailList.push(userData['email']);
    });
  }
}
