import { Component, inject } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-channel-userlist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './channel-userlist.component.html',
  styleUrl: './channel-userlist.component.scss'
})
export class ChannelUserlistComponent {

  channelInfo = inject(SidebarService);

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

}
