import { Component, inject } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { collection, doc, Firestore, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-add-user-to-channel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user-to-channel.component.html',
  styleUrl: './add-user-to-channel.component.scss'
})
export class AddUserToChannelComponent {

  hideOrShowSidebar = inject(SidebarService);
  authService = inject(AuthService);

  activeUserIndex: number | null = null;
  filteredUserList: string[] = this.hideOrShowSidebar.userList;
  filteredImageList: string[] = this.hideOrShowSidebar.imageList;
  filteredUidList: string[] = this.hideOrShowSidebar.uidList;
  filteredEmailList: string[] = this.hideOrShowSidebar.emailList;
  searchTerm: string = '';
  result = '';
  addUserEnabled = false;

  constructor(private firestore: Firestore) {}

  onSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
  
    if (this.searchTerm) {
      this.filteredUserList = [];
      this.filteredImageList = [];
      this.filteredUidList = [];
      this.filteredEmailList = [];
  
      this.hideOrShowSidebar.userList.forEach((user, index) => {
        const uid = this.hideOrShowSidebar.uidList[index];
        const isUidInChannel = this.hideOrShowSidebar.GlobalChannelUids[this.hideOrShowSidebar.currentChannelNumber].includes(uid);
        const isUserAlreadySelected = this.hideOrShowSidebar.selectedUids.includes(uid);
  
        if (user.toLowerCase().includes(this.searchTerm) && !isUidInChannel && !isUserAlreadySelected) {
          this.filteredUserList.push(user);
          this.filteredImageList.push(this.hideOrShowSidebar.imageList[index]);
          this.filteredUidList.push(uid);
          this.filteredEmailList.push(this.hideOrShowSidebar.emailList[index]);
        }
      });
    } else {
      this.filteredUserList = [];
      this.filteredImageList = [];
      this.filteredUidList = [];
      this.filteredEmailList = [];
    }
  }
  
  selectUser(i: number) {
    const selectedUid = this.filteredUidList[i];
    if (!this.hideOrShowSidebar.selectedUids.includes(selectedUid)) {
      this.hideOrShowSidebar.selectedUsers.push(this.filteredUserList[i]);
      this.hideOrShowSidebar.selectedImages.push(this.filteredImageList[i]);
      this.hideOrShowSidebar.selectedUids.push(selectedUid);
      this.hideOrShowSidebar.selectedEmails.push(this.filteredEmailList[i]);
      this.filteredUserList.splice(i, 1);
      this.filteredImageList.splice(i, 1);
      this.filteredUidList.splice(i, 1);
      this.filteredEmailList.splice(i, 1);
      this.searchTerm = '';
    }
  
    this.addUserEnabled = this.hideOrShowSidebar.selectedUsers.length > 0;
  }
  


  closeDialog() {
    this.hideOrShowSidebar.addUserFromHeaderToChannelOpen = false;
  }

  notCloseDialog(e: any) {
    e.stopPropagation(e);
  }

  closeDialogAddUser() {
    this.hideOrShowSidebar.addUserFromHeaderToChannelOpen = false;
  }

  notCloseDialogAddUser(e: any) {
    e.stopPropagation(e);
  }

  async saveUsers() {
  
    const channelId = this.hideOrShowSidebar.AllChannelsIds[this.hideOrShowSidebar.currentChannelNumber];
    const channelRef = doc(collection(this.firestore, 'Channels'), channelId);
  
    try {
      const channelDoc = await getDoc(channelRef);
      if (channelDoc.exists()) {
        const channelData = channelDoc.data();
        const updatedUsers = [...(channelData['users'] || []), ...this.hideOrShowSidebar.selectedUsers];
        const updatedImages = [...(channelData['images'] || []), ...this.hideOrShowSidebar.selectedImages];
        const updatedUids = [...(channelData['uids'] || []), ...this.hideOrShowSidebar.selectedUids];
        const updatedEmails = [...(channelData['emails'] || []), ...this.hideOrShowSidebar.selectedEmails];
        await updateDoc(channelRef, {
          users: updatedUsers,
          images: updatedImages,
          uids: updatedUids,
          emails: updatedEmails
        });
        this.hideOrShowSidebar.selectedUsers = [];
        this.hideOrShowSidebar.selectedImages = [];
        this.hideOrShowSidebar.selectedUids = [];
        this.hideOrShowSidebar.selectedEmails = [];
        this.addUserEnabled = false;
        this.hideOrShowSidebar.fetchChannels();
        this.searchTerm = '';
        this.closeDialog();
      }
    } catch (error) {
      console.error('Fehler beim Speichern der Daten:', error);
    }
  }
  

  userActive(i: number) {
    this.activeUserIndex = i;
    alert(this.activeUserIndex);
  }

  
deleteUser(i: number) {
    this.hideOrShowSidebar.selectedUsers.splice(i, 1);
    this.hideOrShowSidebar.selectedImages.splice(i, 1);
    this.hideOrShowSidebar.selectedUids.splice(i, 1);
    this.hideOrShowSidebar.selectedEmails.splice(i, 1);
    if(this.hideOrShowSidebar.selectedUsers.length > 0){
      this.addUserEnabled = true;
    }else {
      this.addUserEnabled = false;
    }
    this.searchTerm = '';
  }
}
