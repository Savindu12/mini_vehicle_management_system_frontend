import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../../../core/services/profile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  loading = true;
  savingProfile = false;
  savingImage = false;
  savingPassword = false;

  error: string | null = null;
  success: string | null = null;

  user: any = null;

  first_name = '';
  last_name = '';
  username = '';
  email = '';
showCurrentPassword = false;
showNewPassword = false;
showConfirmNewPassword = false;
  imageFile: File | null = null;
  previewUrl: string | null = null;

  current_password = '';
  password = '';
  password_confirmation = '';

  constructor(private profileApi: ProfileService) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch() {
    this.loading = true;
    this.profileApi.getProfile().subscribe({
      next: (res) => {
        this.user = res.user;
        this.first_name = this.user.first_name || '';
        this.last_name = this.user.last_name || '';
        this.username = this.user.username || '';
        this.email = this.user.email || '';
        this.previewUrl = this.user.profile_image_url || null;
        this.loading = false;
        
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load profile';
      },
    });
  }

  clearMsgs() {
    this.error = null;
    this.success = null;
  }

  onSelectImage(ev: any) {
    const f = ev?.target?.files?.[0];
    if (!f) return;
    this.imageFile = f;

    const reader = new FileReader();
    reader.onload = () => (this.previewUrl = String(reader.result));
    reader.readAsDataURL(f);
  }

  saveProfile() {
    this.clearMsgs();
    if (!this.first_name || !this.last_name || !this.username || !this.email) {
      this.error = 'Please fill all profile fields.';
      return;
    }

    this.savingProfile = true;
    this.profileApi.updateProfile({
      first_name: this.first_name,
      last_name: this.last_name,
      username: this.username,
      email: this.email,
    }).subscribe({
      next: (res) => {
        this.user = res.user;
        this.savingProfile = false;
        this.success = 'Profile updated successfully';
      },
      error: (err) => {
        this.savingProfile = false;
        this.error = err?.error?.message || 'Update failed';
      },
    });
  }

  uploadImage() {
    this.clearMsgs();
    if (!this.imageFile) {
      this.error = 'Please select an image first.';
      return;
    }

    const fd = new FormData();
    fd.set('profile_image', this.imageFile);

    this.savingImage = true;
    this.profileApi.updateImage(fd).subscribe({
      next: (res) => {
        this.user = res.user;
        this.savingImage = false;
        this.success = 'Profile image updated';

          window.location.reload();

      },
      error: (err) => {
        this.savingImage = false;
        this.error = err?.error?.message || 'Image upload failed';
      },
    });
  }

  changePassword() {
    this.clearMsgs();
    if (!this.current_password || !this.password || !this.password_confirmation) {
      this.error = 'Please fill all password fields.';
      return;
    }
    if (this.password !== this.password_confirmation) {
      this.error = 'New passwords do not match.';
      return;
    }

    this.savingPassword = true;
    this.profileApi.changePassword({
      current_password: this.current_password,
      password: this.password,
      password_confirmation: this.password_confirmation,
    }).subscribe({
      next: (res) => {
        this.savingPassword = false;
        this.success = res?.message || 'Password updated';
        this.current_password = '';
        this.password = '';
        this.password_confirmation = '';
      },
      error: (err) => {
        this.savingPassword = false;
        this.error = err?.error?.message || 'Password update failed';
      },
    });
  }
}