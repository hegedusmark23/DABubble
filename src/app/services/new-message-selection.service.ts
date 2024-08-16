import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewMessageSelectionService {
  private allUserSortedSubject = new BehaviorSubject<any[]>([]);
  private allChannelSortedSubject = new BehaviorSubject<any[]>([]);

  setAllUserSorted(data: any[]) {
    this.allUserSortedSubject.next(data);
  }

  getAllUserSorted() {
    return this.allUserSortedSubject.asObservable(); // Return as Observable
  }

  setAllChannelSorted(data: any[]) {
    this.allChannelSortedSubject.next(data);
  }

  getAllChannelSorted() {
    return this.allChannelSortedSubject.asObservable(); // Return as Observable
  }
}
