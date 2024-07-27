import { Component, inject } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-create-channel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-channel.component.html',
  styleUrl: './create-channel.component.scss'
})
export class CreateChannelComponent {

  hideOrShowSidebar = inject(SidebarService);
  newChannel = {
    name  : '',
    description : ''
  }

  closeDialog(){
    this.hideOrShowSidebar.createChannelDialogActive = false;
  }

  notCloseDialog(e : any){
    e.stopPropagation(e);
  }

  saveChannel(){
    //alert(this.newChannel.name);
    //alert(this.newChannel.description);
    this.closeDialog();
  }

}
