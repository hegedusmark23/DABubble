import { Injectable } from '@angular/core';
import { collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { Channel } from '../../models/channel';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
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
  
  async searchAllChannelMessages(searchTerm: string) {
    const normalizedTerm = searchTerm.toLowerCase();
    const channelsRef = collection(this.firestore, 'Channels');
    
    // Get all channels
    const channelsSnapshot = await getDocs(channelsRef);
    const messages: any[] = [];
  
    for (const channelDoc of channelsSnapshot.docs) {
      const channelId = channelDoc.id;
      const messagesRef = collection(this.firestore, `Channels/${channelId}/messages`);
      
      // Get all messages in the current channel
      const messagesSnapshot = await getDocs(messagesRef);
      
      // Filter messages in the current channel
      const filteredMessages = messagesSnapshot.docs
        .map(doc => doc.data())
        .filter(message => 
          message['message'] && message['message'].toLowerCase().includes(normalizedTerm)
        );
  
      messages.push(...filteredMessages);
    }
  
    //console.log('All matching messages found:', messages); // Debugging
    return messages;
  }
  
  async searchUsers(searchTerm: string) {
    const normalizedTerm = searchTerm.toLowerCase();
    const usersRef = collection(this.firestore, 'Users');
    
    // This will get all users, so we will filter in the application
    const q = query(usersRef);
    const querySnapshot = await getDocs(q);
  
    // Filter results client-side due to lack of case-insensitive queries in Firestore
    const users = querySnapshot.docs
      .map(doc => doc.data())
      .filter(user => 
        user['name'] && user['name'].toLowerCase().includes(normalizedTerm)
      );
  
    //console.log('Users found:', users); // Debugging
    return users;
  }
}
