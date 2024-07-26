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
  AllChannels = ['Allgemein', 'Entwicklerteam', 'Office-team'];
  AllUsers = ['Du', 'Joost', 'Mark', 'Gabor'];
  activeChannelIndex: number | null = null;
  activeUserIndex: number | null = null; 
  usersTitleActive = false;

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
    alert(this.AllChannels[i] + ' open');
  }

  userActive(i: number) {
    this.activeUserIndex = i;
    alert(this.AllUsers[i] + ' open');
  }

  addMessage() {
    alert('Add new message');
  }

  openUsersList() {
    this.usersTitleActive = !this.usersTitleActive;
  }

  addNewMessage() {
    alert('Add new message window open');
  }
}
