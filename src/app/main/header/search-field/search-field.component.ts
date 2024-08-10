import { Component } from '@angular/core';
import { SearchService } from '../../../services/search.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-field.component.html',
  styleUrl: './search-field.component.scss'
})
export class SearchFieldComponent {
  channels: any[] = [];
  users: any[] = [];
  messages: any[] = [];

  constructor(private searchService: SearchService) {}

  async onSearch(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.trim().toLowerCase();
    console.log('Search Term:', searchTerm); // Debugging line

    if (searchTerm) {
      console.log('Searching channels...'); // Debugging line
      this.channels = await this.searchService.searchChannels(searchTerm);
      console.log('Channels found:', this.channels); // Debugging line

      console.log('Searching users...'); // Debugging line
      this.users = await this.searchService.searchUsers(searchTerm);
      console.log('Users found:', this.users); // Debugging line

      // If you're testing with a specific channel ID, replace 'specificChannelID' with an actual ID
      console.log('Searching messages...'); // Debugging line
      this.messages = await this.searchService.searchChannelMessages('specificChannelID', searchTerm);
      console.log('Messages found:', this.messages); // Debugging line
    } else {
      this.channels = [];
      this.users = [];
      this.messages = [];
    }
  }
}

