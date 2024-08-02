import { Component, inject } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-edit-profil-contactform',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-profil-contactform.component.html',
  styleUrl: './edit-profil-contactform.component.scss'
})
export class EditProfilContactformComponent {

  hideOrShowPopUp = inject(SidebarService);
  userOnline = false;
  userEmail = 'user@irgenwas.com';

  closeDialog(){
    this.hideOrShowPopUp.editProfilContactformOpen = false;
  }

  notCloseDialog(e : any){
    e.stopPropagation(e);
  }

  canel(){
    alert('cancel');
    this.closeDialog();
  }

  save(){
    alert('save user');
  }

}
