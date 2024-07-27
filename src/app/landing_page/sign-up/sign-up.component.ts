import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  
  imgSrcArrow: string = '../../../assets/img/landing-page/arrow-back.png';
  imgSrcCheck: string = '../../../assets/img/landing-page/checkbox-unchecked.png';
  imgSrcUnchecked: string = '../../../assets/img/landing-page/checkbox-unchecked.png';
  imgSrcChecked: string = '../../../assets/img/landing-page/checkbox-checked.png';
  imgSrcUncheckedHover: string = '../../../assets/img/landing-page/checkbox-unchecked-hover.png';
  imgSrcCheckedHover: string = '../../../assets/img/landing-page/checkbox-checked-hover.png';
  isClicked: boolean = false;
  isHoveringOver: boolean = false;
  public submitted:boolean = false;

  constructor() {
    this.updateImageSrc();
  }

  mouseOver(){
    if (this.imgSrcCheck == "../../../assets/img/landing-page/checkbox-unchecked.png") {
      this.imgSrcCheck = "../../../assets/img/landing-page/checkbox-unchecked-hover.png"
    } else {
      this.imgSrcCheck = "../../../assets/img/landing-page/checkbox-checked-hover.png"
    }
  }

  mouseOut(){
    if (this.imgSrcCheck == "../../../assets/img/landing-page/checkbox-unchecked-hover.png") {
      this.imgSrcCheck = "../../../assets/img/landing-page/checkbox-unchecked.png"
    } else if (this.imgSrcCheck == "../../../assets/img/landing-page/checkbox-checked-hover.png" || this.isClicked ) {
      this.imgSrcCheck = "../../../assets/img/landing-page/checkbox-checked.png"
    }
  }

  toggleCheck() {
    this.isClicked = !this.isClicked;
    this.updateImageSrc();
  }

  updateImageSrc() {
    if (this.isClicked) {
      this.imgSrcCheck = this.imgSrcChecked;
    } else {
      this.imgSrcCheck = this.imgSrcUnchecked;
    }
  }
}
