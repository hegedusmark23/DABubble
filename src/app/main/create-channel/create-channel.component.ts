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
  activeUserIndex: number | null = null;

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
    this.hideOrShowSidebar.addUserToChanelOpen = true;
    this.hideOrShowSidebar.createChannelDialogActive = false;
  }

  async saveChannel(){
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
        this.closeDialogAddUser();
      });
  }

  toJSON() {
    return {
      name : this.newChannel.name,
      description : this.newChannel.description
    };
  }

  userActive(i: number){
    this.activeUserIndex = i;
    alert(this.activeUserIndex);
  }

  selectUser(i: number){
    this.hideOrShowSidebar.selectedUsers.push(this.hideOrShowSidebar.AllUsers[i]);
    console.log(this.hideOrShowSidebar.selectedUsers);
  }

  deleteUser(i: number){

  }


}
