import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { ChannelComponent } from "../channel/channel/channel.component";
import { CreateChannelComponent } from "../create-channel/create-channel.component";
import { OpenSidebarComponent } from "../open-sidebar/open-sidebar.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, ChannelComponent, CreateChannelComponent, OpenSidebarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
