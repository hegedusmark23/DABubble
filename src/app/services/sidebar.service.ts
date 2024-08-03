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
  popUpOpen = false;
  editProfilOpen = false;
  editProfilContactformOpen = false;
  userProfilOpen = false;
  activeUser = '';
  activeImage = '';
  activeEmail = '';

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
    const usersCollection = collection(this.firestore, 'Users');
    const querySnapshot = await getDocs(usersCollection);
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      this.AllUsers.push(userData['name']);
      this.AllEmails.push(userData['email']);
      this.AllImages.push(userData['image']);
    });
  }
}
