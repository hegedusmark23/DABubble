import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThreadService {
  private threadSubject = new BehaviorSubject<any>(null);
  currentThread$ = this.threadSubject.asObservable();

  openThread(thread: any) {
    this.threadSubject.next(thread);
  }

  closeThread() {
    this.threadSubject.next(null);
  }
}
