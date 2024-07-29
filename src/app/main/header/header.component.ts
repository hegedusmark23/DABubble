import { Component, inject } from '@angular/core';
import { SearchFieldComponent } from './search-field/search-field.component';
import { SidebarService } from '../../services/sidebar.service';
import { ProfilOptionsPopupComponent } from './profil-options-popup/profil-options-popup.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchFieldComponent, ProfilOptionsPopupComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  hideOrShowPopUp = inject(SidebarService);

  openDialog(){
   this.hideOrShowPopUp.popUpOpen = true;
  }

}
