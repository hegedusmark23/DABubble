import { Component, inject } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-profil-contactform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profil-contactform.component.html',
  styleUrls: ['./edit-profil-contactform.component.scss'] // Correct styleUrls syntax
})
export class EditProfilContactformComponent {
  authService = inject(AuthService);
  hideOrShowPopUp = inject(SidebarService);
  fb = inject(FormBuilder);
  errorMessage: string | null = null;
  successMessage: string | null = null;

  form = this.fb.nonNullable.group({
    name: [this.authService.currentUserSignal()?.name ?? '',
    [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
    email: [this.authService.currentUserSignal()?.email ?? '',
    [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')]],
  });
 
  closeDialog() {
    this.hideOrShowPopUp.editProfilContactformOpen = false;
  }

  notCloseDialog(e: any) {
    e.stopPropagation(e);
  }

  cancel() {
    this.closeDialog();
  }

  async onSubmit() {
    const { email, name } = this.form.getRawValue();
    if (this.form.invalid) {
      this.errorMessage = 'Bitte füllen Sie das Formular korrekt aus.';
      setTimeout(() => {
        this.errorMessage = '';
      }, 2000); 
      return;
    } try {
      await this.authService.updateUserData(email, name);
      this.successMessage = 'Profil erfolgreich aktualisiert.';
      setTimeout(() => {
        this.closeDialog();
        this.errorMessage = '';
        this.successMessage = '';
      }, 2000); 
    } catch (error) {
      console.error(error);
    }
  }
}

