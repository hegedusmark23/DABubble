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
  popUpOpen = false;
  editProfilOpen = false;

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
    const channelsCollection = collection(this.firestore, 'Users');
    const querySnapshot = await getDocs(channelsCollection);
    querySnapshot.forEach((doc) => {
      this.AllUsers.push(doc.id);
    });
  }
}
