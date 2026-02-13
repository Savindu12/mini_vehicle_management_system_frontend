import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent implements OnInit {
  menuOpen = false;

  userName = 'User';
  userEmail = '';
  initials = 'U';
  profileImageUrl: string | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    this.auth.me().subscribe({
      next: (res: any) => {
        const u = res?.user;
        if (!u) return;

        const displayName =
          `${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() ||
          u.username ||
          'User';

        this.userName = displayName;
        this.userEmail = u.email || '';
        this.profileImageUrl = u.profile_image_url || null;

        const parts = displayName.split(' ').filter(Boolean);
        this.initials = (parts[0]?.[0] || 'U') + (parts[1]?.[0] || '');
      },
      error: () => {},
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  goProfile() {
    this.menuOpen = false;
    this.router.navigate(['/profile']);
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        this.auth.clearToken();
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.auth.clearToken();
        this.router.navigate(['/auth/login']);
      },
    });
  }
}