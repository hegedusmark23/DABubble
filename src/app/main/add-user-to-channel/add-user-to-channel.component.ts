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
  

  addSelectedUser(){
    this.hideOrShowSidebar.addAllUsersToChannel = false;
    this.hideOrShowSidebar.addSelectedUsersToChannel = true;
  }

  addAllUser(){
    this.hideOrShowSidebar.addAllUsersToChannel = true;
    this.hideOrShowSidebar.addSelectedUsersToChannel = false;
  }

  closeDialog(){
    this.hideOrShowSidebar.addUserToChanelOpen = false;
  }

  notCloseDialog(e : any){
    e.stopPropagation(e);
  }

  createChannel(){
    if(this.hideOrShowSidebar.addAllUsersToChannel){
      alert('Added channel with all users');
    }else{
      alert('Added channel with selected users');
    }
  }

}
