import { Component } from '@angular/core';
import { SearchService } from '../../../services/search.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  
  constructor(private searchService: SearchService) { }

  async onSearch(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.trim().toLowerCase();

    if (searchTerm) {
      this.channels = await this.searchService.searchChannels(searchTerm);
      this.users = await this.searchService.searchUsers(searchTerm);
      this.messages = await this.searchService.searchAllChannelMessages(searchTerm);
      this.isSearching = true;
    } else {
      this.channels = [];
      this.users = [];
      this.messages = [];
      this.isSearching = false;
    }
    console.log(this.isSearching)
  }

  highlight(text: string): string {
    if (!this.searchTerm) return text;
    const regex = new RegExp(`(${this.searchTerm})`, 'gi');
    return text.replace(regex, `<span class="highlight">$1</span>`);
  }

}




