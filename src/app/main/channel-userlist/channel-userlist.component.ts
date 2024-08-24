import { Component, inject } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-channel-userlist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './channel-userlist.component.html',
  styleUrl: './channel-userlist.component.scss'
})
export class ChannelUserlistComponent {

  channelInfo = inject(SidebarService);
  authService = inject(AuthService);

  closeDialog() {
    this.channelInfo.openUserList = false;
  }

  notCloseDialog(e: any) {
    e.stopPropagation(e);
  }

  addUserToChannel(){
    this.channelInfo.addUserFromHeaderToChannelOpen = true;
    this.closeDialog();
  }

  openUserProfil(i: number){
    this.channelInfo.userProfilOpen = true;
    this.channelInfo.activeUser = this.channelInfo.userList[i];
    this.channelInfo.activeEmail = this.channelInfo.emailList[i];;
    this.channelInfo.activeImage = this.channelInfo.imageList[i];
    this.channelInfo.activeUid = this.channelInfo.uidList[i];
    this.closeDialog();
  }

}
