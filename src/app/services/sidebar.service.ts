import { inject, Injectable } from '@angular/core';
import { collection, Firestore, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  sidebarOpen = false;
  createChannelDialogActive = false;
  AllChannels : string[] = [];
  AllUsers : string[] = [];
  AllEmails : string[] = [];
  AllImages : string[] = [];
  AllUids : string[] = [];
  userList : string[] = [];
  imageList : string[] = [];
  popUpOpen = false;
  editProfilOpen = false;
  editProfilContactformOpen = false;
  userProfilOpen = false;
  addUserToChanelOpen = false;
  addAllUsersToChannel = true;
  addSelectedUsersToChannel = false;
  selectedUsers: any[] = [];
  selectedImages: any[] = [];
  activeUser = '';
  activeImage = '';
  activeEmail = '';
  activeUid = '';

  constructor(private firestore: Firestore) { }

  async fetchChannels() {
    this.AllChannels = [];
    const channelsCollection = collection(this.firestore, 'Channels');
    const querySnapshot = await getDocs(channelsCollection);
    querySnapshot.forEach((doc) => {
      this.AllChannels.push(doc.id);
    });
  }

  async fetchUsers() {
    this.AllUsers = [];
    this.userList = [];
    this.imageList = [];
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
      this.userList = this.AllUsers;
      this.imageList = this.AllImages;
    });
  }
}
