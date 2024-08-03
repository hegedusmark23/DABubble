import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut,
  updateProfile,
  user,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode
} from '@angular/fire/auth';
import { catchError, from, Observable } from 'rxjs';
import { UserInterFace } from '../../models/user.interface';
import { SaveNewUserService } from './save-new-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  firebaseAuth = inject(Auth)
  user$ = user(this.firebaseAuth)
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
          this.currentUserSignal.set({
            name,
            email,
            imgUrl
          });
          console.log("User signed in with Google:", name, email);
          this.saveUser.saveUser(email, name, imgUrl);
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

  register(email: string, name: string, password: string, imgUrl: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password)
      .then(response => {
        return updateProfile(response.user, { displayName: name, photoURL: imgUrl });
      })
      .catch(error => {
        console.error('Error updating profile:', error);
      });

    return from(promise);
  }

  logIn(email: string, password: string): Observable<void> {
    return from(
      signInWithEmailAndPassword(this.firebaseAuth, email, password).then(() => {
      })
    )
  }

  logOut(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }

  passwordReset(email: string): Promise<void> {
    return sendPasswordResetEmail(this.firebaseAuth, email);
  }

  changePassword(actionCode: string, newPassword: string): Promise<void> {
    return verifyPasswordResetCode(this.firebaseAuth, actionCode)
      .then((email) => {
        console.log('Password reset code verified for email:', email);
        return confirmPasswordReset(this.firebaseAuth, actionCode, newPassword)
          .then(() => {
            console.log('Password reset confirmed and updated for email:', email);
            return this.logIn(email, newPassword).toPromise();
          })
          .catch((error) => {
            console.error('Error during password confirmation:', error);
            throw new Error('Failed to reset password. The code might have expired or the password is too weak.');
          });
      })
      .catch((error) => {
        console.error('Error verifying password reset code:', error);
        throw new Error('Invalid or expired password reset code.');
      });
  }

}