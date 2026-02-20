import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  totalBooks: number = 0;
  totalReaders: number = 0;
  isLoading: boolean = false;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    this.dashboardService.getDashboardData().subscribe({
      next: (res: any) => {
        // console.log(res)
        this.totalBooks = res.total_books;   
        this.totalReaders = res.total_readers; 
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}