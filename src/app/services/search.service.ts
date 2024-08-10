import { Injectable } from '@angular/core';
import { collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private firestore: Firestore) {}

  async searchChannels(searchTerm: string) {
    const channelsRef = collection(this.firestore, 'Channels');
    const q = query(
      channelsRef,
      where('name', '>=', searchTerm),
      where('name', '<=', searchTerm + '\uf8ff')
    );
    const querySnapshot = await getDocs(q);
    console.log('Channels found:', querySnapshot.docs.map(doc => doc.data())); // Debugging
    return querySnapshot.docs.map(doc => doc.data());
  }
  
  async searchChannelMessages(channelID: string, searchTerm: string) {
    const messagesRef = collection(this.firestore, `Channels/${channelID}/messages`);
    const q = query(
      messagesRef,
      where('message', '>=', searchTerm),
      where('message', '<=', searchTerm + '\uf8ff')
    );
    const querySnapshot = await getDocs(q);
    console.log('Messages found:', querySnapshot.docs.map(doc => doc.data())); // Debugging
    return querySnapshot.docs.map(doc => doc.data());
  }
  
  async searchUsers(searchTerm: string) {
    const usersRef = collection(this.firestore, 'Users');
    const q = query(
      usersRef,
      where('name', '>=', searchTerm),
      where('name', '<=', searchTerm + '\uf8ff')
    );
    const querySnapshot = await getDocs(q);
    console.log('Users found:', querySnapshot.docs.map(doc => doc.data())); // Debugging
    return querySnapshot.docs.map(doc => doc.data());
  }
}
