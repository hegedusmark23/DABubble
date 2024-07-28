import { inject, Injectable } from '@angular/core';
import { collection, Firestore, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  sidebarOpen = false;
  createChannelDialogActive = false;
  AllChannels: string[] = [];

  constructor(private firestore: Firestore) { }

  async fetchChannels() {
    this.AllChannels = [];
    const channelsCollection = collection(this.firestore, 'Channels');
    const querySnapshot = await getDocs(channelsCollection);
    querySnapshot.forEach((doc) => {
      this.AllChannels.push(doc.id);
    });
  }
}
