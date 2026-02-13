import { Component, OnInit } from '@angular/core';
import { DriverService } from '../../../../core/services/driver.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-drivers-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './drivers-list.component.html',
  styleUrl: './drivers-list.component.css'
})
export class DriversListComponent implements OnInit {
  loading = false;
  saving = false;
  error: string | null = null;

  drivers: any[] = [];
  meta: any = null;
  page = 1;

  q = '';

  // modal
  modalOpen = false;
  editing: any | null = null;

  // form fields
  name = '';
  license_number = '';
  phone = '';
  address = '';

  profile_image_file: File | null = null;
  previewUrl: string | null = null;

  constructor(private driversApi: DriverService) {}

  ngOnInit(): void {
    this.loadDrivers(1);
  }

  loadDrivers(page: number) {
    this.loading = true;
    this.page = page;
    this.error = null;

    this.driversApi.list({ q: this.q || undefined, page }).subscribe({
      next: (res) => {
        this.drivers = res.data || [];
        this.meta = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load drivers';
      },
    });
  }

  applyFilters() {
    this.loadDrivers(1);
  }

  clearFilters() {
    this.q = '';
    this.loadDrivers(1);
  }

  openCreate() {
    this.editing = null;
    this.name = '';
    this.license_number = '';
    this.phone = '';
    this.address = '';
    this.profile_image_file = null;
    this.previewUrl = null;
    this.modalOpen = true;
  }

  openEdit(d: any) {
    this.editing = d;
    this.name = d.name || '';
    this.license_number = d.license_number || '';
    this.phone = d.phone || '';
    this.address = d.address || '';
    this.profile_image_file = null;
    this.previewUrl = d.profile_image_url || null;
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.saving = false;
  }

  onImageSelected(ev: any) {
    const file = ev?.target?.files?.[0];
    if (!file) return;
    this.profile_image_file = file;

    const reader = new FileReader();
    reader.onload = () => (this.previewUrl = String(reader.result));
    reader.readAsDataURL(file);
  }

  submit() {
    this.error = null;
    if (!this.name || !this.license_number || !this.phone || !this.address) {
      this.error = 'Please fill all required fields.';
      return;
    }

    this.saving = true;

    const fd = new FormData();
    fd.set('name', this.name);
    fd.set('license_number', this.license_number);
    fd.set('phone', this.phone);
    fd.set('address', this.address);

    if (this.profile_image_file) fd.set('profile_image', this.profile_image_file);

    const req$ = this.editing
      ? this.driversApi.update(this.editing.id, fd)
      : this.driversApi.create(fd);

    req$.subscribe({
      next: () => {
        this.saving = false;
        this.modalOpen = false;
        this.loadDrivers(this.page);
      },
      error: (err) => {
        this.saving = false;
        this.error = err?.error?.message || 'Save failed (check validation)';
      },
    });
  }

  confirmDelete(d: any) {
    const ok = confirm(`Delete driver "${d.name}"?`);
    if (!ok) return;

    this.driversApi.delete(d.id).subscribe({
      next: () => this.loadDrivers(this.page),
      error: () => alert('Delete failed'),
    });
  }
}