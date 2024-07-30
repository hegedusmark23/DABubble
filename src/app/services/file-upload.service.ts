import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FileUploadeService {
  constructor(private firestore: Firestore) {}

  uploadFile(file: File): Promise<string> {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${file.name}`);
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
          });
        }
      );
    });
  }
}
