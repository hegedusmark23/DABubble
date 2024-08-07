import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ChannelComponent } from '../channel/channel/channel.component';
import { CreateChannelComponent } from '../create-channel/create-channel.component';
import { OpenSidebarComponent } from '../open-sidebar/open-sidebar.component';
import { EditProfilComponent } from '../edit-profil/edit-profil.component';
import { EditProfilContactformComponent } from '../edit-profil-contactform/edit-profil-contactform.component';
import { UserProfilComponent } from '../user-profil/user-profil.component';
import { AddUserToChannelComponent } from '../add-user-to-channel/add-user-to-channel.component';
import { DirectMessagesComponent } from '../direct-messages/direct-messages/direct-messages.component';
import { CommonModule } from '@angular/common';
import { OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DirectMessageSelectionService } from '../../services/direct-message-selection.service';
import { ChannelSelectionService } from '../../services/channel-selection.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    ChannelComponent,
    CreateChannelComponent,
    OpenSidebarComponent,
    EditProfilComponent,
    EditProfilContactformComponent,
    UserProfilComponent,
    AddUserToChannelComponent,
    DirectMessagesComponent,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  channelSelector: any = false;
  selectedUserSubscription: any = false;
  selectedUser: any;

  constructor(public channelSelectionService: ChannelSelectionService) {}
}
