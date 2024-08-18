import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  user,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  updateEmail,
  signInAnonymously
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { UserInterFace } from '../../models/user.interface';
import { SaveNewUserService } from './save-new-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth = inject(Auth);
  user$ = user(this.firebaseAuth);
  currentUserSignal = signal<UserInterFace | null | undefined>(undefined);
  provider = new GoogleAuthProvider();
  saveUser = inject(SaveNewUserService);

  signInWithGoogle(): Observable<void> {
    return from(
      signInWithPopup(this.firebaseAuth, this.provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (credential) {
            const token = credential.accessToken;
            console.log("Google Access Token:", token);
          }
          const name = result.user.displayName ?? 'Unknown User';
          const email = result.user.email ?? 'unknown@example.com';
          const imgUrl = result.user.photoURL ?? '';
          const uId = result.user.uid;
          this.currentUserSignal.set({
            name,
            email,
            imgUrl,
            uId,
          });
          console.log("User signed in with Google:", name, email);
          this.saveUser.saveUser(uId, email, name, imgUrl);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error("Error during Google Sign-In:", errorCode, errorMessage);
          if (errorCode === 'auth/account-exists-with-different-credential') {
            console.error('An account already exists with the same email address but different credentials.');
          } else if (errorCode === 'auth/cancelled-popup-request') {
            console.warn('The popup was closed before completing the sign-in.');
          } else {
            console.error('An unknown error occurred during Google Sign-In.');
          }
          throw error;
        })
    );
  }

  register(email: string, name: string, password: string, imgUrl: string): Observable<string> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(response => {
        const uId = response.user.uid;
        return updateProfile(response.user, { displayName: name, photoURL: imgUrl })
          .then(() => {
            this.currentUserSignal.set({
              name,
              email,
              imgUrl,
              uId,
            });
            return uId;
          });
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        throw error;
      });
  
    return from(promise);
  }

  logIn(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password).then((result) => {
      const uId = result.user.uid;
      const name = result.user.displayName ?? 'Unknown User';
      const imgUrl = result.user.photoURL ?? '';
      this.currentUserSignal.set({
        name,
        email,
        imgUrl,
        uId,
      });

      // Optionally save user if needed
      // this.saveUser.saveUser(uId, email, name, imgUrl);
    });
    return from(promise);
  }

  guestLogin(): Observable<void> {
    return from(
      signInAnonymously(this.firebaseAuth)
        .then((result) => {
          const user = result.user;
          if (user) {
            const name = 'Gast';
            const email = "gast@gast.com";
            const imgUrl = "https://firebasestorage.googleapis.com/v0/b/dabubble-3c5b0.appspot.com/o/profileCache%2Fprofile.png?alt=media&token=d5014d48-3413-475b-aca4-3f15ca3aaab4";
            const uId = user.uid;
            return updateProfile(user, { displayName: name, photoURL: imgUrl })
              .then(() => {
                this.currentUserSignal.set({
                  name,
                  email,
                  imgUrl,
                  uId,
                });
                this.saveUser.saveUser(uId, email, name, imgUrl);
                console.log('Guest logged in with UID:', uId);
              });
          } else {
            return Promise.resolve();
          }
        }).catch((error) => {
          console.error('Error during guest login:', error);
          throw error;
        })
    );
  }

  logOut(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }

  passwordReset(email: string): Promise<void> {
    return sendPasswordResetEmail(this.firebaseAuth, email);
  }

  changePassword(actionCode: string, newPassword: string) {
    return verifyPasswordResetCode(this.firebaseAuth, actionCode).then((email) => {
      const accountEmail = email;
      return confirmPasswordReset(this.firebaseAuth, actionCode, newPassword).then(() => {
        console.log('Password reset has been confirmed and updated for email:', accountEmail);
      }).catch((error) => {
        console.error('Error during password confirmation:', error);
        throw new Error('Failed to reset password. The code might have expired or the password is too weak.');
      });
    }).catch((error) => {
      console.error('Invalid or expired action code:', error);
      throw new Error('Invalid or expired password reset code.');
    });
  }
  
  async updateUserData(email: string, name: string): Promise<void> {
    const currentUser = this.firebaseAuth.currentUser;
    if (!currentUser) {
      throw new Error('No user is currently signed in.');
    } try {
      if (currentUser.email !== email) {
        await updateEmail(currentUser, email);
      } if (currentUser.displayName !== name) {
        await updateProfile(currentUser, { displayName: name });
      }
      this.currentUserSignal.set({
        email,
        name,
        imgUrl: currentUser.photoURL ?? '',
        uId: currentUser.uid
      });
      //console.log('User profile updated successfully.');
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

}

