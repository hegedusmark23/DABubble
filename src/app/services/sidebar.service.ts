import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  sidebarOpen = false;
  createChannelDialogActive = false;

  constructor() { }
}
