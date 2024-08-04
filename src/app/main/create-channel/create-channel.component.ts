import { Component, inject } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, setDoc, doc } from '@angular/fire/firestore';

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
  loading = false;

  constructor(private firestore: Firestore) {}

  closeDialog(){
    this.hideOrShowSidebar.createChannelDialogActive = false;
  }

  notCloseDialog(e : any){
    e.stopPropagation(e);
  }

  /* 

  */

  async saveChannel(){
    this.hideOrShowSidebar.addUserToChanelOpen = true;
    this.hideOrShowSidebar.createChannelDialogActive = false;
    /* 
    this.loading = true;
    const channelRef = doc(collection(this.firestore, 'Channels'), this.newChannel.name);
    await setDoc(
      channelRef,
      this.toJSON()
    )
      .catch((err) => {
        console.error(err);
      })
      .then(() => {
        this.loading = false;
        this.newChannel.name = '',
        this.newChannel.description = ''
        this.hideOrShowSidebar.fetchChannels();
        this.closeDialog();
      });
  }

  toJSON() {
    return {
      name : this.newChannel.name,
      description : this.newChannel.description
    };
    */
  }
}
