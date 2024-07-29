import { Component, inject } from '@angular/core';
import { SearchFieldComponent } from './search-field/search-field.component';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchFieldComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  hideOrShowPopUp = inject(SidebarService);

  openDialog(){
   this.hideOrShowPopUp.popUpOpen = true;
  }

}
