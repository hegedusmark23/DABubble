import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChannelSelectionService {
  private selectedChannel = new BehaviorSubject<string>('Entwicklerteam');

  constructor() {}

  // Getter for selectedChannel as an Observable
  getSelectedChannel() {
    return this.selectedChannel.asObservable();
  }

  // Setter for selectedChannel
  setSelectedChannel(channel: string): void {
    this.selectedChannel.next(channel);
  }
}
