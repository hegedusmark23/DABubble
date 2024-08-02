import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss'
})
export class PasswordResetComponent {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  imgSrcArrow: string = '../../../assets/img/landing-page/arrow-back.png';
  succes: boolean = false
  errorMessage: string | null = null;
  successMessage: string | null = null;

  form: FormGroup = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
  }, { validators: this.passwordsMatchValidator });
  
  constructor(){
  }

  onSubmit(): void {
    const newPassword = this.form.get('newPassword')?.value;
    const actionCode = this.route.snapshot.queryParams['oobCode'];

    if (newPassword && this.form.valid) {
      this.authService.changePassword(actionCode, newPassword).then(() => {
        this.succes = true;
          setTimeout(() => {
            this.succes = false;
            this.router.navigateByUrl('/');
          }, 500);
      }).catch((err) => {
        this.errorMessage = 'Failed to reset password: ' + err.message;
      });
    }
  }

  passwordsMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordsMismatch: true };
    }
    return null;
  }

}


