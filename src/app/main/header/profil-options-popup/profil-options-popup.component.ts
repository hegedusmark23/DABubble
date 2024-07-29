import { Component, inject } from '@angular/core';
import { SidebarService } from '../../../services/sidebar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profil-options-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profil-options-popup.component.html',
  styleUrl: './profil-options-popup.component.scss'
})
export class ProfilOptionsPopupComponent {

  hideOrShowPopUp = inject(SidebarService);

  closeDialog(){
    this.hideOrShowPopUp.popUpOpen = false;
  }

  notCloseDialog(e : any){
    e.stopPropagation(e);
  }

  openProfil(){
    alert('Profil edit window open');
  }

  logOut(){
    alert('Logout profil');
  }

}
