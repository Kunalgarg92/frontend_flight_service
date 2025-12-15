import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  template: `
    <h2>Welcome to Flight Service Dashboard</h2>
    <button (click)="logout()">Logout</button>
  `,
})
export class DashboardComponent {
  constructor(private auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
