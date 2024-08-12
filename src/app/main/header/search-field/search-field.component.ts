import { Component } from '@angular/core';
import { SearchService } from '../../../services/search.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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

}




