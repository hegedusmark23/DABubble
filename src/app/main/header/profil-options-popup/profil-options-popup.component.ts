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
  styleUrl: './profil-options-popup.component.scss'
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
    alert('Profil edit window open');
  }

  logOut() {
    this.authService.logOut().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

}
