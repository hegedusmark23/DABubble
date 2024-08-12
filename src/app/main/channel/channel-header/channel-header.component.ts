import { Component } from '@angular/core';
import { EditChannelComponent } from '../../edit-channel/edit-channel.component';
import { EditChannelService } from '../../../services/edit-channel.service';
import { ChannelSelectionService } from '../../../services/channel-selection.service';

@Component({
  selector: 'app-channel-header',
  standalone: true,
  imports: [EditChannelComponent],
  templateUrl: './channel-header.component.html',
  styleUrl: './channel-header.component.scss',
})
export class ChannelHeaderComponent {
  currentChannel: any;

  constructor(
    public editChannelService: EditChannelService,
    private channelSelectionService: ChannelSelectionService
  ) {}

  ngOnInit(): void {
    this.channelSelectionService.getSelectedChannel().subscribe((channel) => {
      this.currentChannel = channel;
    });
  }
}
