import { Component, OnInit } from '@angular/core';
import { DirectMessageSelectionService } from '../../../services/direct-message-selection.service';

@Component({
  selector: 'app-direct-messages',
  standalone: true,
  imports: [],
  templateUrl: './direct-messages.component.html',
  styleUrl: './direct-messages.component.scss',
})
export class DirectMessagesComponent implements OnInit {
  user: any;
  constructor(
    public directMessageSelectionService: DirectMessageSelectionService
  ) {}
  ngOnInit(): void {
    this.setUser();
  }

  setUser() {
    this.directMessageSelectionService
      .getSelectedChannel()
      .subscribe((value) => {
        this.user = value;
        console.log(this.user);
      });
  }
}
