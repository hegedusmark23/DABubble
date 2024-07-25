import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  hoveredChannelTitle = false; 
  activetedChannelTitle = false; 
  activeChannel = false;
  AllChannels = ['Entwicklerteam' , 'Office-team'];

  hoverChannelTitle(){
    this.hoveredChannelTitle = true;
  }

  hoverEndChannelTitle(){
    this.hoveredChannelTitle = false;
  }

  activeteChannelTitle(){
    if(!this.activetedChannelTitle){
      this.activetedChannelTitle = true;
    }else{
      this.activetedChannelTitle = false;
    }
  }

  addChannel(){
    alert('Add channel popup on!');
  }

  channelActive(i: number) {
    alert(`Channel ausgewählt: ${this.AllChannels[i]}`);
    this.activeChannel = true;
  }

}
