import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewMessageSelectionService } from '../../../services/new-message-selection.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-message-search-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-message-search-results.component.html',
  styleUrls: ['./new-message-search-results.component.scss'],
})
export class NewMessageSearchResultsComponent implements OnInit, OnDestroy {
  allUserSorted: any[] = [];
  allChannelSorted: any[] = [];

  userSubscription: any;
  channelSubscription: any;

  constructor(private newMessageSelectionService: NewMessageSelectionService) {}

  ngOnInit(): void {
    this.userSubscription = this.newMessageSelectionService
      .getAllUserSorted()
      .subscribe((data) => {
        this.allUserSorted = data;
        console.log('Updated user list:', this.allUserSorted);
      });

    this.channelSubscription = this.newMessageSelectionService
      .getAllChannelSorted()
      .subscribe((data) => {
        this.allChannelSorted = data;
        console.log('Updated channel list:', this.allChannelSorted);
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.channelSubscription) {
      this.channelSubscription.unsubscribe();
    }
  }
}
