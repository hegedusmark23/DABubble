import { Component, inject } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';


@Component({
  selector: 'app-edit-profil-contactform',
  standalone: true,
  imports: [],
  templateUrl: './edit-profil-contactform.component.html',
  styleUrl: './edit-profil-contactform.component.scss'
})
export class EditProfilContactformComponent {

  hideOrShowPopUp = inject(SidebarService);
  userOnline = false;
  userEmail = 'user@irgenwas.com';

  closeDialog(){
    this.hideOrShowPopUp.editProfilOpen = false;
  }

  notCloseDialog(e : any){
    e.stopPropagation(e);
  }

}
