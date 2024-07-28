import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { collection, getDocs, Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent  implements OnInit{
  hoveredChannelTitle = false; 
  activetedChannelTitle = false; 
  AllUsers = ['Du', 'Joost', 'Mark', 'Gabor'];
  activeChannelIndex: number | null = null;
  activeUserIndex: number | null = null; 
  usersTitleActive = false;

  hideOrShowSidebar = inject(SidebarService);

  ngOnInit(): void {
    this.hideOrShowSidebar.fetchChannels();
  }

  constructor(private firestore: Firestore) {
  }

  

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
    this.hideOrShowSidebar.createChannelDialogActive = true;
  }

  channelActive(i: number) {
    this.activeChannelIndex = i; 
    alert(this.hideOrShowSidebar.AllChannels[i] + ' open');
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
