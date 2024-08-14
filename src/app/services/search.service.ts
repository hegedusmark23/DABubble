import { inject, Injectable } from '@angular/core';
import { collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { Channel } from '../../models/channel';
import { User } from '../../models/user';
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
    const q = query(
      channelsRef,
      where('name', '>=', normalizedTerm),
      where('name', '<=', normalizedTerm + '\uf8ff')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Channel));
  }
  
  async searchAllChannelMessages(searchTerm: string): Promise<any[]> {
    const normalizedTerm = searchTerm.toLowerCase();
    const filteredMessages: any[] | PromiseLike<any[]> = [];
  
    // Feltételezve, hogy minden csatornánál van egy messages tömb
    for (let channelIndex = 0; channelIndex < this.hideOrShowSidebar.AllChannels.length; channelIndex++) {
      const messages = await this.getMessagesForChannel(this.hideOrShowSidebar.AllChannelsUids[channelIndex]);
      messages.forEach((message, messageIndex) => {
        if (message.text.toLowerCase().includes(normalizedTerm)) {
          filteredMessages.push({
            channelId: this.hideOrShowSidebar.AllChannelsUids[channelIndex],
            message: message.text,
            messageId: message.id, // Ha az üzenetnek van ID-ja
          });
        }
      });
    }
  
    return filteredMessages;
  }
  
  async getMessagesForChannel(channelId: string): Promise<any[]> {
    // Implementáld a csatorna üzeneteinek lekérdezését
    const messagesRef = collection(this.firestore, `Channels/${channelId}/messages`);
    const querySnapshot = await getDocs(messagesRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, text: doc.data()['message'] }));
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
  
    console.log('Filtered Users:', filteredUsers); // Debugging
    return filteredUsers;
  }
}
