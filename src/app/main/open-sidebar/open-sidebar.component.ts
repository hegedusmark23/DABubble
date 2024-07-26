import { Component } from '@angular/core';

@Component({
  selector: 'app-open-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './open-sidebar.component.html',
  styleUrl: './open-sidebar.component.scss'
})
export class OpenSidebarComponent {

  sidebarOpen = false;

  openSidebarMenu(){
    this.sidebarOpen = !this.sidebarOpen;
    alert(this.sidebarOpen);

  }

}
