import { Component, inject } from '@angular/core';
import { EditChannelComponent } from '../../edit-channel/edit-channel.component';
import { EditChannelService } from '../../../services/edit-channel.service';
import { ChannelSelectionService } from '../../../services/channel-selection.service';
import { SidebarService } from '../../../services/sidebar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-channel-header',
  standalone: true,
  imports: [EditChannelComponent ,CommonModule],
  templateUrl: './channel-header.component.html',
  styleUrl: './channel-header.component.scss',
})
export class ChannelHeaderComponent {
  currentChannel: any;
  channelInfo = inject(SidebarService);
  userNumber : number = 0;

  constructor(
    public editChannelService: EditChannelService,
    private channelSelectionService: ChannelSelectionService
  ) {}

  ngOnInit(): void {
    this.channelSelectionService.getSelectedChannel().subscribe((channel) => {
      this.currentChannel = channel;
    });
  }

  openAddUserToChannel(){
    this.channelInfo.addUserFromHeaderToChannelOpen = true;
    alert('Add user to channel window open');
  }
}
