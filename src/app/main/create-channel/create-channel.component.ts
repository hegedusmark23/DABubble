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
    description : '',
    users : [],
    images : []
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
        this.newChannel.description = '',
        this.newChannel.users = []
        this.hideOrShowSidebar.fetchChannels();
        this.closeDialogAddUser();
      });
  }

  toJSON() {
    return {
      name : this.newChannel.name,
      description : this.newChannel.description,
      users : this.hideOrShowSidebar.selectedUsers,
      images : this.hideOrShowSidebar.selectedImages
    };
  }

  userActive(i: number){
    this.activeUserIndex = i;
    alert(this.activeUserIndex);
  }

  selectUser(i: number){
    this.hideOrShowSidebar.selectedUsers.push(this.hideOrShowSidebar.userList[i]);
    this.hideOrShowSidebar.selectedImages.push(this.hideOrShowSidebar.imageList[i]);
    this.hideOrShowSidebar.userList.splice(i, 1);
    this.hideOrShowSidebar.imageList.splice(i, 1);
    console.log(this.hideOrShowSidebar.selectedUsers);
  }

  deleteUser(i: number){
    this.hideOrShowSidebar.userList.push(this.hideOrShowSidebar.selectedUsers[i]);
    this.hideOrShowSidebar.imageList.push(this.hideOrShowSidebar.selectedImages[i]);
    this.hideOrShowSidebar.selectedUsers.splice(i, 1);
    this.hideOrShowSidebar.selectedImages.splice(i, 1);
    console.log(this.hideOrShowSidebar.selectedUsers);
  }


}
