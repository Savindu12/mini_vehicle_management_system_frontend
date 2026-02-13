import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DriverService } from '../../../../core/services/driver.service';
import { VehicleService } from '../../../../core/services/vehicle.service';

type Driver = { id: number; name: string; license_number: string };
type Vehicle = any;

@Component({
  selector: 'app-vehicles-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicles-list.component.html',
  styleUrl: './vehicles-list.component.css'
})
export class VehiclesListComponent implements OnInit {
  loading = false;
  error: string | null = null;
  vehicles: Vehicle[] = [];
  meta: any = null;
  page = 1;
  q = '';
  status = '';
  vehicle_type = '';

  drivers: Driver[] = [];
  driversLoading = false;

  modalOpen = false;
  saving = false;
  editing: Vehicle | null = null;

  vehicle_name = '';
  registration_number = '';
  form_vehicle_type: 'Truck' | 'Van' | 'Mini-bus' | '' = '';
  form_status: 'Available' | 'In Maintenance' | 'On Route' | '' = '';
  driver_id: number | null = null;

  vehicle_image_file: File | null = null;
  previewUrl: string | null = null;

  constructor(private vehiclesApi: VehicleService, private driversApi: DriverService) {}

  ngOnInit(): void {
    this.loadDrivers();
    this.loadVehicles(1);
  }

  loadVehicles(page: number) {
    this.loading = true;
    this.error = null;
    this.page = page;

    this.vehiclesApi
      .list({ q: this.q || undefined, status: this.status || undefined, vehicle_type: this.vehicle_type || undefined, page })
      .subscribe({
        next: (res) => {
          this.vehicles = res.data || [];
          this.meta = res;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.error = 'Failed to load vehicles';
        },
      });
  }

  loadDrivers() {
    this.driversLoading = true;
    this.driversApi.list({ q: '', page: 1 }).subscribe({
      next: (res) => {
        this.drivers = res.data || [];
        this.driversLoading = false;
      },
      error: () => {
        this.driversLoading = false;
      },
    });
  }

  applyFilters() {
    this.loadVehicles(1);
  }

  clearFilters() {
    this.q = '';
    this.status = '';
    this.vehicle_type = '';
    this.loadVehicles(1);
  }

  openCreate() {
    this.editing = null;
    this.vehicle_name = '';
    this.registration_number = '';
    this.form_vehicle_type = '';
    this.form_status = 'Available';
    this.driver_id = null;
    this.vehicle_image_file = null;
    this.previewUrl = null;
    this.modalOpen = true;
  }

  openEdit(v: any) {
    this.editing = v;
    this.vehicle_name = v.vehicle_name || '';
    this.registration_number = v.registration_number || '';
    this.form_vehicle_type = v.vehicle_type || '';
    this.form_status = v.status || '';
    this.driver_id = v.driver_id ?? null;

    this.vehicle_image_file = null;
    this.previewUrl = v.vehicle_image_url || null;

    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.saving = false;
  }

  onImageSelected(ev: any) {
    const file = ev?.target?.files?.[0];
    if (!file) return;
    this.vehicle_image_file = file;

    const reader = new FileReader();
    reader.onload = () => (this.previewUrl = String(reader.result));
    reader.readAsDataURL(file);
  }

  submit() {
    this.error = null;

    if (!this.vehicle_name || !this.registration_number || !this.form_vehicle_type || !this.form_status) {
      this.error = 'Please fill all required fields.';
      return;
    }

    this.saving = true;

    const fd = new FormData();
    fd.set('vehicle_name', this.vehicle_name);
    fd.set('registration_number', this.registration_number);
    fd.set('vehicle_type', this.form_vehicle_type);
    fd.set('status', this.form_status);

    if (this.driver_id) fd.set('driver_id', String(this.driver_id));
    else fd.set('driver_id', ''); 

    if (this.vehicle_image_file) fd.set('vehicle_image', this.vehicle_image_file);

    const req$ = this.editing
      ? this.vehiclesApi.update(this.editing.id, fd)
      : this.vehiclesApi.create(fd);

    req$.subscribe({
      next: () => {
        this.saving = false;
        this.modalOpen = false;
        this.loadVehicles(this.page);
      },
      error: (err) => {
        this.saving = false;
        this.error = err?.error?.message || 'Save failed (check validation)';
      },
    });
  }

  confirmDelete(v: any) {
    const ok = confirm(`Delete vehicle "${v.vehicle_name}"?`);
    if (!ok) return;

    this.vehiclesApi.delete(v.id).subscribe({
      next: () => this.loadVehicles(this.page),
      error: () => alert('Delete failed'),
    });
  }

  statusClass(s: string) {
    if (s === 'Available') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s === 'In Maintenance') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-sky-50 text-sky-700 border-sky-200';
  }
}