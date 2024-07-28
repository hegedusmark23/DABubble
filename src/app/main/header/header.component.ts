import { Component } from '@angular/core';
import { SearchFieldComponent } from './search-field/search-field.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchFieldComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  openDialog(){
    alert('Edit Profil/Logout');
  }

}
