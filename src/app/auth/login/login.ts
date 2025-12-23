import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [FormsModule, RouterModule, CommonModule],
})
export class LoginComponent {
  username = '';
  password = '';
  loginError = false;

  constructor(private auth: AuthService, private router: Router) {}

  login(form: any) {
    if (form.invalid) return;

    const payload = {
      username: this.username,
      password: this.password,
    };

    this.auth.login(payload).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userEmail', res.email); // Add this line!
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loginError = true;
      },
    });
  }
}
