import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  router = inject(Router);
  imgSrcArrow: string = '../../../assets/img/landing-page/arrow-back.png';
  emailSent: boolean = false
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')]]
  });

  constructor(private _location: Location) {
  }

  onSubmit() {
    if (this.form.valid) {
      const email = this.form.get('email')?.value;
      this.authService.passwordReset(email!)
        .then(() => {
          this.emailSent = true;
          setTimeout(() => {
            this.emailSent = false;
            this.router.navigateByUrl('/');
          }, 500);
        })
        .catch(error => {
          console.error('Error sending password reset email:', error);
        });
    } else {
      console.log('Form is invalid');
    }
  }

  goBack() {
    this._location.back();
  }
}
