import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./main/header/header.component";
import { OpenSidebarComponent } from "./main/open-sidebar/open-sidebar.component";
import { SidebarComponent } from "./main/sidebar/sidebar.component";
import { ChannelComponent } from "./main/channel/channel/channel.component";
import { LogInComponent } from "./landing_page/log-in/log-in.component";
import { CreateChannelComponent } from './main/create-channel/create-channel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, OpenSidebarComponent, SidebarComponent, ChannelComponent, LogInComponent,
    CreateChannelComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'DABubble';
}
