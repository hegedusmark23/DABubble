import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { ChannelComponent } from "../channel/channel/channel.component";
import { CreateChannelComponent } from "../create-channel/create-channel.component";
import { OpenSidebarComponent } from "../open-sidebar/open-sidebar.component";
import { EditProfilComponent } from '../edit-profil/edit-profil.component';
import { EditProfilContactformComponent } from '../edit-profil-contactform/edit-profil-contactform.component';
import { UserProfilComponent } from '../user-profil/user-profil.component';
import { AddUserToChannelComponent } from '../add-user-to-channel/add-user-to-channel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, ChannelComponent, CreateChannelComponent, OpenSidebarComponent, 
    EditProfilComponent, EditProfilContactformComponent, UserProfilComponent, AddUserToChannelComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
