import { Injectable } from '@angular/core';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SaveNewUserService {

  constructor(private firestore: Firestore) { }


  userName: string = ''; 
  userMail: string = '';
  userImage: string = ''; 

  async saveUser(email: any, name: any, url: any){
    this.userName = name;
    this.userMail = email;
    this.userImage = url;
    const userRef = doc(collection(this.firestore, 'Users'), this.userName);
    await setDoc(
      userRef,
      this.toJSON()
    )
      .catch((err) => {
        console.error(err);
      })
      .then(() => {
        
      });
  }

  toJSON() {
    return {
      name : this.userName,
      email: this.userMail,
      image: this.userImage
    };
  }
}
