import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-user-profil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profil.component.html',
  styleUrl: './user-profil.component.scss'
})
export class UserProfilComponent {

  hideOrShowSidebar = inject(SidebarService);
  userOnline = true;
  userEmail = 'udgfuid gi@uhegi.eoig'

  closeDialog(){
    this.hideOrShowSidebar.userProfilOpen = false;
  }

  notCloseDialog(e : any){
    e.stopPropagation(e);
  }

  editUser(){

  }

  sendMessage(){
    alert('Nachricht an : ' +  this.hideOrShowSidebar.activeUser );
  }

}
