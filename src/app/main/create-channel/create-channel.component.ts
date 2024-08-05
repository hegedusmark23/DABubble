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

  addSelectedUser(){
    this.hideOrShowSidebar.addAllUsersToChannel = false;
    this.hideOrShowSidebar.addSelectedUsersToChannel = true;
  }

  addAllUser(){
    this.hideOrShowSidebar.addAllUsersToChannel = true;
    this.hideOrShowSidebar.addSelectedUsersToChannel = false;
  }

  closeDialogAddUser(){
    this.hideOrShowSidebar.addUserToChanelOpen = false;
  }

  notCloseDialogAddUser(e : any){
    e.stopPropagation(e);
  }

  createChannel(){
    if(this.hideOrShowSidebar.addAllUsersToChannel){
      alert('Added channel with all users');
    }else{
      alert('Added channel with selected users');
    }
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
