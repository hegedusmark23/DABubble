import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss'
})
export class LogInComponent {

  constructor(private authService: AuthService, private router: Router) {
  }

  googleSignIn(){
    this.authService.signInWithGoogle().then((res: any) => {
      this.router.navigateByUrl('home')
    }).catch((error:any) =>{
      console.error(error);
    });
  }
}
