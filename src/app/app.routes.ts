import { Routes } from '@angular/router';
import { LogInComponent } from './landing_page/log-in/log-in.component';
import { ImpressumComponent } from './landing_page/impressum/impressum.component';
import { PrivacyPolicyComponent } from './landing_page/privacy-policy/privacy-policy.component';
import { SignUpComponent } from './landing_page/sign-up/sign-up.component';

export const routes: Routes = [
    { path: '', component: LogInComponent},
    { path: 'sign-up', component: SignUpComponent},
    { path: 'impressum', component: ImpressumComponent},
    { path: 'privacy', component: PrivacyPolicyComponent}
];
