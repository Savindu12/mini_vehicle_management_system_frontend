import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  loading = true;

  counts: any = null;
  recentVehicles: any[] = [];
  recentDrivers: any[] = [];

  pieChartType: ChartType = 'pie';
  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Available', 'In Maintenance', 'On Route'],
    datasets: [{ data: [0, 0, 0] }],
  };
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  barChartType: ChartType = 'bar';
  barChartData: ChartData<'bar', number[], string | string[]> = {
    labels: ['Vehicles Total', 'Drivers Total', 'Available', 'Maintenance', 'On Route'],
    datasets: [{ data: [0, 0, 0, 0, 0], label: 'Count' }],
  };
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {},
      y: { beginAtZero: true },
    },
  };

  constructor(private dashboard: DashboardService) {}

  ngOnInit(): void {
    this.loading = true;

    this.dashboard.summary().subscribe({
      next: (res) => {
        this.counts = res.counts;

        const available = Number(this.counts.vehicles_available ?? 0);
        const maintenance = Number(this.counts.vehicles_in_maintenance ?? 0);
        const onRoute = Number(this.counts.vehicles_on_route ?? 0);

        this.pieChartData = {
          labels: ['Available', 'In Maintenance', 'On Route'],
          datasets: [{ data: [available, maintenance, onRoute] }],
        };

        this.barChartData = {
          labels: ['Vehicles Total', 'Drivers Total', 'Available', 'Maintenance', 'On Route'],
          datasets: [
            {
              data: [
                Number(this.counts.vehicles_total ?? 0),
                Number(this.counts.drivers_total ?? 0),
                available,
                maintenance,
                onRoute,
              ],
              label: 'Count',
            },
          ],
        };
      },
      error: () => {},
    });

    this.dashboard.recent(5, 5).subscribe({
      next: (res) => {
        this.recentVehicles = res.recent_vehicles || [];
        this.recentDrivers = res.recent_drivers || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}