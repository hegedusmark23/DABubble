import { Component, inject } from '@angular/core';
import { SidebarService } from '../../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil-options-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profil-options-popup.component.html',
  styleUrls: ['./profil-options-popup.component.scss', './profil-options-popup-responsive.component.scss']
})
export class ProfilOptionsPopupComponent {
  authService = inject(AuthService)
  hideOrShowPopUp = inject(SidebarService);
  router = inject(Router);

  closeDialog(){
    this.hideOrShowPopUp.popUpOpen = false;
  }

  notCloseDialog(e : any){
    e.stopPropagation(e);
  }

  openProfil(){
    this.hideOrShowPopUp.editProfilOpen = true;
  }

  logOut() {
    this.authService.logOut().subscribe(() => {
      this.router.navigate(['/']);
    });
    this.hideOrShowPopUp.popUpOpen = false;
    this.hideOrShowPopUp.currentChannelNumber = 0;
  }

}
