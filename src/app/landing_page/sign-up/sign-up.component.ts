import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { getStorage, ref } from "firebase/storage";

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);


  imgSrcArrow: string = '../../../assets/img/landing-page/arrow-back.png';
  imgSrcCheck: string = '../../../assets/img/landing-page/checkbox-unchecked.png';
  imgSrcUnchecked: string = '../../../assets/img/landing-page/checkbox-unchecked.png';
  imgSrcChecked: string = '../../../assets/img/landing-page/checkbox-checked.png';
  imgSrcUncheckedHover: string = '../../../assets/img/landing-page/checkbox-unchecked-hover.png';
  imgSrcCheckedHover: string = '../../../assets/img/landing-page/checkbox-checked-hover.png';

  profileImgsSrc: string[]  = [
    '../../../assets/img/profile-imgs/female1.png',
    '../../../assets/img/profile-imgs/female2.png',
    '../../../assets/img/profile-imgs/male1.png',
    '../../../assets/img/profile-imgs/male2.png',
    '../../../assets/img/profile-imgs/male3.png',
    '../../../assets/img/profile-imgs/male4.png',
  ]
  stepTwo: boolean = false;
  isClicked: boolean = false;
  isHoveringOver: boolean = false;
  public submitted:boolean = false;

  errorMessage: string | null = null;

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  })
  

  constructor(private _location: Location) {
    this.updateImageSrc();
  }

  goBack() {
    this._location.back();
  }

  toggleStep(){
    this.stepTwo = !this.stepTwo
  }

  onSubmit(): void {
    const rawForm = this.form.getRawValue();
    this.authService.register(rawForm.email, rawForm.name, rawForm.password).subscribe({
      next:() => {
      this.router.navigateByUrl('/');
    },
    error: (err) => {
      this.errorMessage = err.code;
    }
  });
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
