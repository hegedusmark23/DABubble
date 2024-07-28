import { Component } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {
  imgSrcArrow: string = '../../../assets/img/landing-page/arrow-back.png';

  constructor(private _location: Location){
  }

  goBack() {
    this._location.back();
  }
}
