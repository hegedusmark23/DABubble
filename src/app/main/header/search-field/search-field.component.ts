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
    console.log('Selected user ID:', userId); // Debugging
    const userIndex = this.hideOrShowSidebar.AllUids.findIndex(uid => uid === userId);
    if (userIndex !== -1) {
      this.userActive(userIndex);
      this.isSearching = false;
    } else {
      console.log('User not found with ID:', userId);
    }
  }

  onMessageClick(channelId: string, messageId: string) {
    const channelIndex = this.hideOrShowSidebar.AllChannelsUids.findIndex(id => id === channelId);
    if (channelIndex !== -1) {
      this.channelActive(channelIndex);
      // Görgetés az üzenethez
      this.scrollToMessage(messageId);
    }
  }
  
  scrollToMessage(messageId: string) {
    // Implementáld a görgetést az üzenethez
    const messageElement = document.getElementById(messageId);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      messageElement.classList.add('highlighted-message'); // Optional: highlight
    }
  }

  channelActive(i: number) {
    this.hideOrShowSidebar.currentChannelNumber = i;
    this.channelSelectionService.setSelectedChannel(this.channels[i].name);
    this.hideOrShowSidebar.AllChannels[i]; // Simulate opening the channel
  }

  userActive(i: number) {
    this.hideOrShowSidebar.activeUserIndex = i;
    this.hideOrShowSidebar.userProfilOpen = true;
    this.hideOrShowSidebar.activeUser = this.hideOrShowSidebar.AllUsers[i];
    this.hideOrShowSidebar.activeEmail = this.hideOrShowSidebar.AllEmails[i];
    this.hideOrShowSidebar.activeImage = this.hideOrShowSidebar.AllImages[i];
    this.hideOrShowSidebar.activeUid = this.hideOrShowSidebar.AllUids[i];
    console.log('Activated user:', {
      name: this.hideOrShowSidebar.AllUsers[i],
      email: this.hideOrShowSidebar.AllEmails[i],
      image: this.hideOrShowSidebar.AllImages[i],
      uid: this.hideOrShowSidebar.AllUids[i]
    });
  }
}




