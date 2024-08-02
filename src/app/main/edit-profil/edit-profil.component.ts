import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-edit-profil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-profil.component.html',
  styleUrl: './edit-profil.component.scss'
})
export class EditProfilComponent {

  hideOrShowPopUp = inject(SidebarService);
  authService = inject(AuthService);
  userOnline = false;
  userEmail = 'user@irgenwas.com';

  closeDialog(){
    this.hideOrShowPopUp.editProfilOpen = false;
  }

  notCloseDialog(e : any){
    e.stopPropagation(e);
  }

  editUser(){
    this.hideOrShowPopUp.editProfilContactformOpen = true;
    alert('Edit user');
  }

  sendMessage(){
    alert('Message send');
  }

}
