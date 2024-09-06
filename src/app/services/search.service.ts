import { inject, Injectable } from '@angular/core';
import { collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { Channel } from '../../models/channel';
import { SidebarService } from './sidebar.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  hideOrShowSidebar = inject(SidebarService)
  constructor(private firestore: Firestore) {}

  async searchChannels(searchTerm: string): Promise<Channel[]> {
    const normalizedTerm = searchTerm.toLowerCase();
    const channelsRef = collection(this.firestore, 'Channels');
    const querySnapshot = await getDocs(channelsRef);
    const filteredChannels = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        name: doc.data()['name'],
        uids: doc.data()['uids']
      })).filter(channel => channel.name.toLowerCase().includes(normalizedTerm));
    return filteredChannels;
  }
  
  async searchAllChannelMessages(searchTerm: string): Promise<any[]> {
    const normalizedTerm = searchTerm.toLowerCase();
    const filteredMessages = [];
    const channelsRef = collection(this.firestore, 'Channels');
    const channelsSnapshot = await getDocs(channelsRef);
    for (const channelDoc of channelsSnapshot.docs) {
      const channelId = channelDoc.id;
      const messagesRef = collection(this.firestore, `Channels/${channelId}/messages`);
      const messagesSnapshot = await getDocs(messagesRef);
      for (const messageDoc of messagesSnapshot.docs) {
        const messageData = messageDoc.data();
        //console.log('Message data:', messageData); // Debugging
        if (messageData['message'] && messageData['message'].toLowerCase().includes(normalizedTerm)) {
          filteredMessages.push({
            id: messageDoc.id,
            channelId: channelId,
            message: messageData['message'],
            uid: messageData['uid'],
          });
        }
      }
    }
    //console.log('Filtered Messages:', filteredMessages); 
    return filteredMessages;
  }
  
  async getMessagesForChannel(channelId: string): Promise<any[]> {
    const messagesRef = collection(this.firestore, `Channels/${channelId}/messages`);
    const querySnapshot = await getDocs(messagesRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      text: doc.data()['message'],
    }));
  }
  
  async searchUsers(searchTerm: string): Promise<any[]> {
    const normalizedTerm = searchTerm.toLowerCase();
    const filteredUsers = [];
    for (let i = 0; i < this.hideOrShowSidebar.AllUsers.length; i++) {
      const userName = this.hideOrShowSidebar.AllUsers[i].toLowerCase();
      if (userName.includes(normalizedTerm)) {
        filteredUsers.push({
          uid: this.hideOrShowSidebar.AllUids[i],
          name: this.hideOrShowSidebar.AllUsers[i],
          email: this.hideOrShowSidebar.AllEmails[i],
          image: this.hideOrShowSidebar.AllImages[i],
        });
      }
    }
    //console.log('Filtered Users:', filteredUsers); // Debugging
    return filteredUsers;
  }
}
