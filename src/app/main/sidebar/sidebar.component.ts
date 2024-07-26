import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  hoveredChannelTitle = false; 
  activetedChannelTitle = false; 
  AllChannels = ['Entwicklerteam', 'Office-team'];
  activeChannelIndex: number | null = null; 

  hoverChannelTitle() {
    this.hoveredChannelTitle = true;
  }

  hoverEndChannelTitle() {
    this.hoveredChannelTitle = false;
  }

  activeteChannelTitle() {
    this.activetedChannelTitle = !this.activetedChannelTitle;
  }

  addChannel() {
    alert('Add channel popup on!');
  }

  channelActive(i: number) {
    this.activeChannelIndex = i; 
  }
}
