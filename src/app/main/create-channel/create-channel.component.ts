import { Component, inject } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, setDoc, doc } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-channel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-channel.component.html',
  styleUrl: './create-channel.component.scss',
})
export class CreateChannelComponent {
  hideOrShowSidebar = inject(SidebarService);
  authService = inject(AuthService);

  newChannel = {
    name: '',
    description: '',
    users: [],
    uids: [],
    images: [],
    channelCreator: ''
  };
  loading = false;
  activeUserIndex: number | null = null;
  filteredUserList: string[] = this.hideOrShowSidebar.userList;
  filteredImageList: string[] = this.hideOrShowSidebar.imageList;
  filteredUidList: string[] = this.hideOrShowSidebar.uidList;
  searchTerm: string = '';
  result = '';

  constructor(private firestore: Firestore) {}

  isInputValid(): boolean {
    return this.newChannel.name.length >= 3;
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    
    if (this.searchTerm) {
        this.filteredUserList = [];
        this.filteredImageList = [];
        this.filteredUidList = [];

        this.hideOrShowSidebar.userList.forEach((user, index) => {
            if (user.toLowerCase().includes(this.searchTerm)) {
                this.filteredUserList.push(user);
                this.filteredImageList.push(this.hideOrShowSidebar.imageList[index]);
                this.filteredUidList.push(this.hideOrShowSidebar.uidList[index]);
            }
        });
    } else {
        this.filteredUserList = [];
        this.filteredImageList = [];
        this.filteredUidList = [];
    }
}


  closeDialog() {
    this.hideOrShowSidebar.createChannelDialogActive = false;
  }

  notCloseDialog(e: any) {
    e.stopPropagation(e);
  }

  addSelectedUser() {
    this.hideOrShowSidebar.addAllUsersToChannel = false;
    this.hideOrShowSidebar.addSelectedUsersToChannel = true;
  }

  addAllUser() {
    this.hideOrShowSidebar.addAllUsersToChannel = true;
    this.hideOrShowSidebar.addSelectedUsersToChannel = false;
  }

  closeDialogAddUser() {
    this.hideOrShowSidebar.addUserToChanelOpen = false;
  }

  notCloseDialogAddUser(e: any) {
    e.stopPropagation(e);
  }

  createChannel() {
    this.hideOrShowSidebar.addUserToChanelOpen = true;
    this.hideOrShowSidebar.createChannelDialogActive = false;
  }

  generateId(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 28; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        this.result += characters[randomIndex];
    }
    return this.result;
}

  async saveChannel() {
    this.loading = true;
    const channelRef = doc(
      collection(this.firestore, 'Channels'),
      this.generateId()
    );
    await setDoc(channelRef, this.toJSON())
      .catch((err) => {
        console.error(err);
      })
      .then(() => {
        this.loading = false;
        this.newChannel.name = '',
        this.newChannel.description = '',
        this.newChannel.channelCreator = '';
        this.newChannel.users = [];
        this.hideOrShowSidebar.selectedUsers = [];
        this.hideOrShowSidebar.selectedImages = [];
        this.hideOrShowSidebar.selectedUids = [];
        this.hideOrShowSidebar.userList = [];
        this.hideOrShowSidebar.imageList = [];
        this.hideOrShowSidebar.uidList = [];
        this.hideOrShowSidebar.userList = this.hideOrShowSidebar.AllUsers; 
        this.hideOrShowSidebar.imageList = this.hideOrShowSidebar.AllImages; 
        this.hideOrShowSidebar.uidList = this.hideOrShowSidebar.AllUids;
        this.hideOrShowSidebar.fetchChannels();
        this.hideOrShowSidebar.fetchUsers();
        this.closeDialogAddUser();
      });
  }

  toJSON() {
    if (this.hideOrShowSidebar.addAllUsersToChannel) {
      return {
        name: this.newChannel.name,
        description: this.newChannel.description,
        users: this.hideOrShowSidebar.userList,
        uids: this.hideOrShowSidebar.uidList,
        images: this.hideOrShowSidebar.imageList,
        channelCreator: this.newChannel.channelCreator = this.authService.currentUserSignal()?.name || ''
      };
    } else {
      return {
        name: this.newChannel.name,
        description: this.newChannel.description,
        users: this.hideOrShowSidebar.selectedUsers,
        uids: this.hideOrShowSidebar.selectedUids,
        images: this.hideOrShowSidebar.selectedImages,
        channelCreator: this.newChannel.channelCreator = this.authService.currentUserSignal()?.name || ''
      };
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
        this.hideOrShowSidebar.userList.splice(indexInMainList, 1);
        this.hideOrShowSidebar.imageList.splice(indexInMainList, 1);
        this.hideOrShowSidebar.uidList.splice(indexInMainList, 1);
        this.filteredUserList.splice(i, 1);
        this.filteredImageList.splice(i, 1);
        this.filteredUidList.splice(i, 1);
        this.filteredUserList = [];
        this.filteredImageList = [];
        this.filteredUidList = [];
        this.searchTerm = '';
    }
}

deleteUser(i: number) {
    this.hideOrShowSidebar.userList.push(this.hideOrShowSidebar.selectedUsers[i]);
    this.hideOrShowSidebar.imageList.push(this.hideOrShowSidebar.selectedImages[i]);
    this.hideOrShowSidebar.uidList.push(this.hideOrShowSidebar.selectedUids[i]);
    this.hideOrShowSidebar.selectedUsers.splice(i, 1);
    this.hideOrShowSidebar.selectedImages.splice(i, 1);
    this.hideOrShowSidebar.selectedUids.splice(i, 1);
    this.filteredUserList = this.hideOrShowSidebar.userList.slice();
    this.filteredImageList = this.hideOrShowSidebar.imageList.slice();
    this.filteredUidList = this.hideOrShowSidebar.uidList.slice();
}

}
