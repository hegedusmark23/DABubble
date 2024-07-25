import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  hoveredChannelTitle = false; 
  activetedChannelTitle = false; 

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

}
