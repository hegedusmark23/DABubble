import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import { getStorage, ref } from "firebase/storage";
import { deleteObject, getDownloadURL, uploadBytesResumable } from '@angular/fire/storage';

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
  imgUrl: string  = '';
  errorMessage: string | null = null;
  selectedFileCache: File | null = null;
  selectectUrlCache: any;
  selectetFileNameCache: any;
  selectedFile: File | null = null;
  selectectUrl: any;
  selectetFileName: any;
  registerSuccesful: boolean = false
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

  async onSubmit(): Promise<void> {
    const rawForm = this.form.getRawValue();
    if (this.selectedFile) {
      await this.saveFile();
    }
    this.authService.register(rawForm.email, rawForm.name, rawForm.password, this.imgUrl).subscribe({
      next:() => {
      this.registerSuccesful = true;
      setTimeout(() => {
        this.registerSuccesful = false;
        this.router.navigateByUrl('/');
      }, 500);
    },
    error: (err) => {
      this.errorMessage = err.code;
    }
  });
  }

  chooseAvatar(profileImg: string){
    this.imgUrl = profileImg;
  }

  onFileSelected(event: any) {
    if (this.selectectUrlCache) {
      this.deleteCachedFile(this.selectetFileNameCache.name);
    }
    this.selectedFileCache = event.target.files[0];
    this.saveFileToCache();
  }

  async saveFile() {
    console.log(this.selectedFile);
    this.selectedFile = this.selectedFileCache;
    if (this.selectedFile) {
      const imageUrl = await this.uploadFile(
        this.selectedFile
      );
      console.log(imageUrl);
      this.selectetFileName = this.selectedFile;
      this.selectectUrl = imageUrl;
    } else {
      console.error('No file selected');
    }
    this.deleteCachedFile(this.selectedFileCache!.name)
  }

  async saveFileToCache() {
    if (this.selectedFileCache) {
      const imageUrl = await this.uploadFileToCache(
        this.selectedFileCache
      );
      this.selectetFileNameCache = this.selectedFileCache;
      this.selectectUrlCache = imageUrl;
    } else {
      console.error('No file selected');
    }
  }

  uploadFile(file: File): Promise<string> {
    const storage = getStorage();
    const storageRef = ref(storage, `profileImages/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: any) => {
            resolve(downloadURL);
            this.imgUrl = downloadURL;
          });
        }
      );
    });
  }

  uploadFileToCache(file: File): Promise<string> {
    const storage = getStorage();
    const storageRef = ref(storage, `profileCache/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: any) => {
            resolve(downloadURL);
            this.imgUrl = downloadURL;
          });
        }
      );
    });
  }

  async deleteCachedFile(fileUrl: string): Promise<void> {
    const storage = getStorage();
    const fileRef = ref(storage, `profileCache/${fileUrl}`);

    return deleteObject(fileRef)
      .then(() => {
        console.log('File deleted successfully');
        this.selectectUrlCache = null;
      })
      .catch((error) => {
        console.error('Error deleting file:', error);
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
