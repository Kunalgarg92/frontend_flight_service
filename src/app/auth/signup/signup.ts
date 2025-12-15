import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-signup',
  templateUrl: './signup.html',
  imports: [FormsModule, RouterModule, CommonModule],
})
export class SignupComponent {
  user = {
    name: '',
    email: '',
    password: '',
  };

  constructor(private auth: AuthService, private router: Router) {}

  emailExists = false;

  signup(form: any) {
    if (form.invalid) return;

    const payload = {
      username: this.user.name,
      email: this.user.email,
      password: this.user.password,
      roles: ['ROLE_USER'],
    };

    this.auth.signup(payload).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.status === 409) {
          this.emailExists = true;
        }
      },
    });
  }
}
