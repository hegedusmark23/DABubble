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

  constructor(private firestore: Firestore) {}


  onSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();

    if (this.searchTerm) {
        this.filteredUserList = [];
        this.filteredImageList = [];
        this.filteredUidList = [];
        this.filteredEmailList = [];

        this.hideOrShowSidebar.userList.forEach((user, index) => {
            const isUserInChannel = this.hideOrShowSidebar.AllChannelsUsers[this.hideOrShowSidebar.currentChannelNumber].includes(user);
            const isImageInChannel = this.hideOrShowSidebar.AllChannelsImages[this.hideOrShowSidebar.currentChannelNumber].includes(this.hideOrShowSidebar.imageList[index]);
            const isUidInChannel = this.hideOrShowSidebar.AllChannelsUids[this.hideOrShowSidebar.currentChannelNumber].includes(this.hideOrShowSidebar.uidList[index]);
            if (user.toLowerCase().includes(this.searchTerm) && !isUserInChannel && !isImageInChannel && !isUidInChannel) {
                this.filteredUserList.push(user);
                this.filteredImageList.push(this.hideOrShowSidebar.imageList[index]);
                this.filteredUidList.push(this.hideOrShowSidebar.uidList[index]);
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
        this.hideOrShowSidebar.fetchChannels();
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

  selectUser(i: number) {
    const indexInMainList = this.hideOrShowSidebar.userList.indexOf(this.filteredUserList[i]);
    if (indexInMainList !== -1) {
        this.hideOrShowSidebar.selectedUsers.push(this.hideOrShowSidebar.userList[indexInMainList]);
        this.hideOrShowSidebar.selectedImages.push(this.hideOrShowSidebar.imageList[indexInMainList]);
        this.hideOrShowSidebar.selectedUids.push(this.hideOrShowSidebar.uidList[indexInMainList]);
        this.hideOrShowSidebar.selectedEmails.push(this.hideOrShowSidebar.emailList[indexInMainList]);
        this.hideOrShowSidebar.userList.splice(indexInMainList, 1);
        this.hideOrShowSidebar.imageList.splice(indexInMainList, 1);
        this.hideOrShowSidebar.uidList.splice(indexInMainList, 1);
        this.hideOrShowSidebar.emailList.splice(indexInMainList, 1);
        this.filteredUserList.splice(i, 1);
        this.filteredImageList.splice(i, 1);
        this.filteredUidList.splice(i, 1);
        this.filteredEmailList.splice(i, 1);
        this.filteredUserList = [];
        this.filteredImageList = [];
        this.filteredUidList = [];
        this.filteredEmailList = [];
        this.searchTerm = '';
    }
}

deleteUser(i: number) {
    this.hideOrShowSidebar.userList.push(this.hideOrShowSidebar.selectedUsers[i]);
    this.hideOrShowSidebar.imageList.push(this.hideOrShowSidebar.selectedImages[i]);
    this.hideOrShowSidebar.uidList.push(this.hideOrShowSidebar.selectedUids[i]);
    this.hideOrShowSidebar.emailList.push(this.hideOrShowSidebar.selectedEmails[i]);
    this.hideOrShowSidebar.selectedUsers.splice(i, 1);
    this.hideOrShowSidebar.selectedImages.splice(i, 1);
    this.hideOrShowSidebar.selectedUids.splice(i, 1);
    this.hideOrShowSidebar.selectedEmails.splice(i, 1);
}
}
