import { Component, inject } from '@angular/core';
import { SearchService } from '../../../services/search.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ChannelSelectionService } from '../../../services/channel-selection.service';
import { SidebarService } from '../../../services/sidebar.service';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

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
  authService = inject(AuthService)
  activeChannelIndex: number | null = null;
  constructor(private searchService: SearchService, 
    private sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef) { }

    async onSearch(event: Event) {
      this.searchTerm = (event.target as HTMLInputElement).value.trim().toLowerCase();
      if (this.searchTerm) {
        this.channels = await this.searchService.searchChannels(this.searchTerm);
        this.users = await this.searchService.searchUsers(this.searchTerm);
        const rawMessages = await this.searchService.searchAllChannelMessages(this.searchTerm);
    
        // Feldolgozzuk az üzeneteket a helyesített megjelenítéshez és hozzáadjuk a felhasználói adatokat
        this.messages = rawMessages.map(message => {
          const username = this.getUsername(message.uid);
          const userImage = this.getUserImage(message.uid);
          return {
            ...message,
            message: this.getMessage(message),
            username: username,
            userImage: userImage,
          };
        });
        
        this.isSearching = true;
      } else {
        this.channels = [];
        this.users = [];
        this.messages = [];
        this.isSearching = false;
      }
    }

  getMessage(message: any): string {
    const regex = /₿ЯæŶ∆Ωг(\S+)/g;
    const modifiedMessage = message.message.replace(
      regex,
      (match: any, p1: any) => {
        const username = this.getUsername(p1);
        if (message.uid !== this.authService.currentUserSignal()?.uId) {
          return `<b>@${username}</b>`;
        } else {
          return `<b>@${username}</b>`;
        }
      }
    );
    return modifiedMessage;
  }
  
  getUsername(uid: string): string {
    const index = this.hideOrShowSidebar.AllUids.indexOf(uid);
    return index !== -1 ? this.hideOrShowSidebar.AllUsers[index] : 'Unknown User';
  }
  
  getUserImage(uid: string): string {
    const index = this.hideOrShowSidebar.AllUids.indexOf(uid);
    return index !== -1 ? this.hideOrShowSidebar.AllImages[index] : 'default-image-url';
  }

  highlight(text: string): SafeHtml {
    if (!this.searchTerm) return text;
    const regex = new RegExp(`(${this.searchTerm})`, 'gi');
    const highlightedText = text.replace(regex, `<span class="highlight">$1</span>`);
    return this.sanitizer.bypassSecurityTrustHtml(highlightedText);
  }

  onChannelClick(channelId: string) {
    //console.log('Channel ID to find:', channelId); 
    //console.log('All channel IDs:', this.hideOrShowSidebar.AllChannelsIds);
    const channelIndex = this.hideOrShowSidebar.AllChannelsIds.findIndex((id, index) => {
        if (id === channelId) {
            return this.hideOrShowSidebar.GlobalChannelUids[index].includes(this.authService.currentUserSignal()?.uId ?? '');
        }
        return false;
    });
    //console.log('Current Channel Index:', this.hideOrShowSidebar.currentChannelNumber);
    if (channelIndex !== -1) {
      this.channelActive(channelIndex);
      this.isSearching = false;
    } else {
      console.error('Kanal nicht gefunden oder Benutzer ist kein Mitglied:', channelId);
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
    const channelIndex = this.hideOrShowSidebar.AllChannelsIds.findIndex((channel, index) => {
        return channel === channelId && this.hideOrShowSidebar.GlobalChannelUids[index].includes(this.authService.currentUserSignal()?.uId ?? '');
    });
    console.log('Navigating to channel index:', channelIndex, 'with ID:', channelId); 
    if (channelIndex !== -1) {
      this.isSearching = false;
      this.channelActive(channelIndex);
      this.scrollToMessage(messageId);
    } else {
      console.error('Kanal nicht gefunden oder Benutzer ist kein Mitglied:', channelId);
    }
}
  
  
  scrollToMessage(messageId: string) {
    setTimeout(() => {
      const messageElement = document.getElementById(messageId);
      if (messageElement) {
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.log('Message element not found with ID:', messageId);
      }
    }, 500);
  }

  channelActive(i: number) {
    this.channelSelectionService.openChannel();
    this.activeChannelIndex = i;
    this.channelSelectionService.setSelectedChannel(this.hideOrShowSidebar.AllChannelsIds[i]);
    this.hideOrShowSidebar.currentChannelNumber = i;
    this.cdRef.detectChanges();
  }
  

  userActive(i: number) {
    this.hideOrShowSidebar.activeUserIndex = i;
    this.hideOrShowSidebar.userProfilOpen = true;
    this.hideOrShowSidebar.activeUser = this.hideOrShowSidebar.AllUsers[i];
    this.hideOrShowSidebar.activeEmail = this.hideOrShowSidebar.AllEmails[i];
    this.hideOrShowSidebar.activeImage = this.hideOrShowSidebar.AllImages[i];
    this.hideOrShowSidebar.activeUid = this.hideOrShowSidebar.AllUids[i];
  }

  
}




