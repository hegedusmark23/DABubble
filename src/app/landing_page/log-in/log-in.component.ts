import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'] // Corrected to `styleUrls`
})
export class LogInComponent {
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);
  errorMessage: string | null = null; // Error message to display

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {}

  googleSignIn() {
    this.authService.signInWithGoogle().subscribe({
      next: () => {
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  guestLogin() {
    this.router.navigateByUrl('/home');
  }

  onSubmit(): void {
    const rawForm = this.form.getRawValue();
    this.authService.logIn(rawForm.email, rawForm.password).subscribe({
      next: () => {
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        this.handleError(err.code); 
      }
    });
  }

  private handleError(errorCode: string): void {
    switch (errorCode) {
      case 'auth/user-not-found':
        this.errorMessage = 'Es existiert kein Benutzer mit dieser E-Mail-Adresse.';
        break;
      case 'auth/invalid-credential':
        this.errorMessage = 'Falsches E-Mail oder Passwort. Bitte überprüfen und erneut versuchen.';
        break;
      case 'auth/invalid-email':
        this.errorMessage = 'Diese E-Mail-Adresse ist ungültig.';
        break;
      case 'auth/too-many-requests':
        this.errorMessage = 'Zu viele fehlgeschlagene Anmeldeversuche. Bitte versuchen Sie es später erneut.';
        break;
      default:
        this.errorMessage = 'Ein unbekannter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
        break;
    }
  }
}
