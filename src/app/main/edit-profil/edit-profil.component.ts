import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-edit-profil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-profil.component.html',
  styleUrl: './edit-profil.component.scss'
})
export class EditProfilComponent {

  hideOrShowPopUp = inject(SidebarService);

}
