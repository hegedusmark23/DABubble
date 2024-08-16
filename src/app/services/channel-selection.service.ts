import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChannelSelectionService {
  private selectedChannel = new BehaviorSubject<string>('Entwicklerteam');
  ChannelOpenVariable: any = true;
  constructor() {}

  // Getter for selectedChannel as an Observable
  getSelectedChannel() {
    return this.selectedChannel.asObservable();
  }

  isChannelOpen() {
    return this.ChannelOpenVariable;
  }

  openChannel() {
    console.log('opening Channel');
    this.ChannelOpenVariable = true;
  }

  closeChannel() {
    this.ChannelOpenVariable = false;
  }

  // Setter for selectedChannel
  setSelectedChannel(channel: string): void {
    console.log(channel);
    this.selectedChannel.next(channel);
  }
}
