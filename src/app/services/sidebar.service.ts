import { inject, Injectable } from '@angular/core';
import { collection, Firestore, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  sidebarOpen = false;
  createChannelDialogActive = false;
  AllChannels : string[] = [];
  AllChannelsUsers : string[] = [];
  AllChannelsImages : string[] = [];
  AllChannelsUids : string[] = [];
  AllUsers : string[] = [];
  AllEmails : string[] = [];
  AllImages : string[] = [];
  AllUids : string[] = [];
  userList : string[] = [];
  imageList : string[] = [];
  uidList : string[] = [];
  popUpOpen = false;
  editProfilOpen = false;
  editProfilContactformOpen = false;
  userProfilOpen = false;
  addUserToChanelOpen = false;
  addAllUsersToChannel = true;
  addSelectedUsersToChannel = false;
  selectedUsers: any[] = [];
  selectedImages: any[] = [];
  selectedUids: any[] = [];
  activeUser = '';
  activeImage = '';
  activeEmail = '';
  activeUid = '';
  currentChannelNumber: number | any;

  constructor(private firestore: Firestore) { }

  async fetchChannels() {
    this.AllChannels = [];
    this.AllChannelsUsers = [];
    this.AllChannelsImages = [];
    this.AllChannelsUids = [];

    const channelsCollection = collection(this.firestore, 'Channels');
    const querySnapshot = await getDocs(channelsCollection);
    querySnapshot.forEach((doc) => {
      const channelData = doc.data();
      this.AllChannels.push(channelData['name']);
      this.AllChannelsUsers.push(channelData['users']);
      this.AllChannelsUids.push(channelData['uids']);
      this.AllChannelsImages.push(channelData['images']);
    });
  }

  async fetchUsers() {
    this.AllUsers = [];
    this.userList = [];
    this.imageList = [];
    this.uidList = [];
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
      //this.userList = this.AllUsers;
      //this.imageList = this.AllImages;
    });
  }
}
