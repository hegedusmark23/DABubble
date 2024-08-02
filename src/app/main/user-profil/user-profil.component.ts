import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-profil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profil.component.html',
  styleUrl: './user-profil.component.scss'
})
export class UserProfilComponent {

  hideOrShowSidebar = inject(SidebarService);
  authService = inject(AuthService);
  userOnline = true;
  userEmail = 'udgfuid gi@uhegi.eoig'

  closeDialog(){
    this.hideOrShowSidebar.userProfilOpen = false;
  }

  notCloseDialog(e : any){
    e.stopPropagation(e);
  }

  sendMessage(){
    alert('Nachricht an : ' +  this.hideOrShowSidebar.activeUser );
  }

}
