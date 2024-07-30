import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);
  errorMessage: string | null = null;

  form = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  })
  
  
  constructor() {

  }

  guestLogin(){
    this.router.navigateByUrl('/home');
  }

  onSubmit(): void {
    const rawForm = this.form.getRawValue();
    this.authService.logIn(rawForm.email, rawForm.password).subscribe({
      next:() => {
      this.router.navigateByUrl('/home');
    },
    error: (err) => {
      this.errorMessage = err.code;
    }
  });
  }
}
