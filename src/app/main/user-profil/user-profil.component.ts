import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../services/auth.service';
import { DirectMessageSelectionService } from '../../services/direct-message-selection.service';
import { ChannelSelectionService } from '../../services/channel-selection.service';
import { ResponsiveService } from '../../services/responsive.service';

@Component({
  selector: 'app-user-profil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profil.component.html',
  styleUrls: ['./user-profil.component.scss', './user-profil-responsive.component.scss']
})
export class UserProfilComponent {
  hideOrShowSidebar = inject(SidebarService);
  authService = inject(AuthService);
  responsiveService = inject(ResponsiveService);
  userOnline = true;
  userEmail = 'udgfuid gi@uhegi.eoig';
  Gast = 'Gast';

  constructor(
    public directMessageSelectionService: DirectMessageSelectionService,
    private channelSelectionService: ChannelSelectionService
  ) {}

  closeDialog() {
    this.hideOrShowSidebar.userProfilOpen = false;
  }

  notCloseDialog(e: any) {
    e.stopPropagation(e);
  }

  sendMessage() {
    this.updateSelectedUser();
    this.responsiveService.isDirectMessageOpen = true;
    if (window.innerWidth < 1000) {
        this.responsiveService.isSidebarOpen = false;
    }
}

  updateSelectedUser() {
    this.channelSelectionService.openDirectMessage();
    this.directMessageSelectionService.setSelectedChannel(
      this.hideOrShowSidebar.activeUid
    );
    this.hideOrShowSidebar.userProfilOpen = false;
  }
}
