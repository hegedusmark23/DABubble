import { Component, inject } from '@angular/core';
import { SearchService } from '../../../services/search.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ChannelSelectionService } from '../../../services/channel-selection.service';
import { SidebarService } from '../../../services/sidebar.service';

@Component({
  selector: 'app-search-field',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './search-field.component.html',
  styleUrl: './search-field.component.scss'
})
export class SearchFieldComponent {
  [x: string]: any;
  channels: any[] = [];
  users: any[] = [];
  messages: any[] = [];
  isSearching: boolean = false;
  searchTerm: string = '';
  channelSelectionService = inject(ChannelSelectionService)
  hideOrShowSidebar = inject(SidebarService);
  constructor(private searchService: SearchService, private sanitizer: DomSanitizer) { }

  async onSearch(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (this.searchTerm) {
      this.channels = await this.searchService.searchChannels(this.searchTerm);
      this.users = await this.searchService.searchUsers(this.searchTerm);
      this.messages = await this.searchService.searchAllChannelMessages(this.searchTerm);
      this.isSearching = true;
    } else {
      this.channels = [];
      this.users = [];
      this.messages = [];
      this.isSearching = false;
    }
  }

  highlight(text: string): SafeHtml {
    if (!this.searchTerm) return text;
    const regex = new RegExp(`(${this.searchTerm})`, 'gi');
    const highlightedText = text.replace(regex, `<span class="highlight">$1</span>`);
    return this.sanitizer.bypassSecurityTrustHtml(highlightedText);
  }

  onChannelClick(channelId: string) {
    const channelIndex = this.channels.findIndex(channel => channel.id === channelId);
    if (channelIndex !== -1) {
      this.channelActive(channelIndex);
      this.isSearching = false;
    }
  }

  onUserClick(userId: string) {
    console.log('Selected user ID:', userId);
    const userIndex = this.hideOrShowSidebar.AllUids.findIndex(uid => uid === userId);
    if (userIndex !== -1) {
      this.userActive(userIndex);
      this.isSearching = false;
    } else {
      console.log('User not found with ID:', userId);
    }
  }

  onMessageClick(channelId: string, messageId: string) {
    const channelIndex = this.hideOrShowSidebar.AllChannels.findIndex(channel => channel === channelId);
    console.log('Navigating to channel index:', channelIndex, 'with ID:', channelId); 
  
    if (channelIndex !== -1) {
      this.isSearching = false;
      this.channelActive(channelIndex);
      this.scrollToMessage(messageId);
    } else {
      console.error('Channel not found:', channelId);
    }
  }
  
  
  scrollToMessage(messageId: string) {
    // Implementáld a görgetést az üzenethez
    setTimeout(() => {
      const messageElement = document.getElementById(messageId);
      if (messageElement) {
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        //messageElement.classList.add('highlighted-message'); // Optional: highlight
      } else {
        console.log('Message element not found with ID:', messageId);
      }
    }, 500);
  }

  channelActive(i: number) {
    console.log('Active channel index:', i); 
    const channelName = this.hideOrShowSidebar.AllChannels[i];
    if (!channelName) {
      console.error('Channel not found at index:', i); 
      return;
    }
    this.channelSelectionService.openChannel();
    this['activeChannelIndex'] = i;
    this.channelSelectionService.setSelectedChannel(channelName);
    this.hideOrShowSidebar.currentChannelNumber = i;
    /*console.log('Opening channel:', channelName); // Ellenőrizd a csatorna nevét
    console.log('Channel users:', this.hideOrShowSidebar.AllChannelsUsers[i]);
    console.log('Channel images:', this.hideOrShowSidebar.AllChannelsImages[i]);
    console.log('Channel UIDs:', this.hideOrShowSidebar.AllChannelsUids[i]);*/
  }

  userActive(i: number) {
    this.hideOrShowSidebar.activeUserIndex = i;
    this.hideOrShowSidebar.userProfilOpen = true;
    this.hideOrShowSidebar.activeUser = this.hideOrShowSidebar.AllUsers[i];
    this.hideOrShowSidebar.activeEmail = this.hideOrShowSidebar.AllEmails[i];
    this.hideOrShowSidebar.activeImage = this.hideOrShowSidebar.AllImages[i];
    this.hideOrShowSidebar.activeUid = this.hideOrShowSidebar.AllUids[i];
    /*console.log('Activated user:', {
      name: this.hideOrShowSidebar.AllUsers[i],
      email: this.hideOrShowSidebar.AllEmails[i],
      image: this.hideOrShowSidebar.AllImages[i],
      uid: this.hideOrShowSidebar.AllUids[i]
    });*/
  }
}




