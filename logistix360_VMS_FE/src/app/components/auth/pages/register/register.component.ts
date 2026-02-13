import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  first_name = '';
  last_name = '';
  username = '';
  email = '';
  password = '';
  password_confirmation = '';
showPassword = false;
showConfirmPassword = false;

  loading = false;
  error: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = null;

    if (!this.first_name || !this.last_name || !this.username || !this.email || !this.password || !this.password_confirmation) {
      this.error = 'Please fill all fields.';
      return;
    }

    if (this.password !== this.password_confirmation) {
      this.error = 'Passwords do not match.';
      return;
    }

    this.loading = true;

    this.auth.register({
      first_name: this.first_name,
      last_name: this.last_name,
      username: this.username,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation,
    }).subscribe({
      next: () => {
        this.loading = false;
        // after register -> go login
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Registration failed';
      },
    });
  }
}
