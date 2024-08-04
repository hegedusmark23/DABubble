import { Component, inject } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-user-to-channel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-user-to-channel.component.html',
  styleUrl: './add-user-to-channel.component.scss'
})
export class AddUserToChannelComponent {

  hideOrShowSidebar = inject(SidebarService);
  addAllUsers = true;
  addSelectedUsers = false;

  addSelectedUser(){
    this.addAllUsers = false;
    this.addSelectedUsers = true;
  }

  addAllUser(){
    this.addAllUsers = true;
    this.addSelectedUsers = false;
  }

  closeDialog(){
    this.hideOrShowSidebar.addUserToChanelOpen = false;
  }

  notCloseDialog(e : any){
    e.stopPropagation(e);
  }

}
