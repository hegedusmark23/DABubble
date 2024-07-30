import { inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, user } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { UserInterFace } from '../../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  firebaseAuth = inject(Auth)
  user$ = user(this.firebaseAuth)
  currentUserSignal = signal<UserInterFace | null | undefined>(undefined);
  

  constructor() { }

  signInWithGoogle() {
  }

  register(email: string, name: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.firebaseAuth,
    email,
    password,
  ).then(response => updateProfile(response.user, {displayName: name}));
  return from(promise);
  }

  logIn(email: string, password: string ): Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password).then(() => {});
    return from(promise);
  }

  logOut(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }
}