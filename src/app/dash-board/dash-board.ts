import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../api-service';
import { Footer } from '../DashBoardmaterials/footer/footer';
import { Header } from '../DashBoardmaterials/header/header';
import { Layout } from '../DashBoardmaterials/layout/layout';
import { Sidebar } from '../DashBoardmaterials/sidebar/sidebar';

@Component({
  selector: 'app-dash-board',
  imports: [CommonModule, RouterModule, Header, Sidebar, Footer],
  templateUrl: './dash-board.html',
  styleUrl: './dash-board.scss'
})
export class DashBoard {
  jobs: any[] = [];
  loading = true;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.fetchJobs();
  }

  fetchJobs(): void {
    this.api.JobDetailsForDashBoard().subscribe({
      next: (res) => {
        this.jobs = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching jobs:', err);
        this.loading = false;
      }
    });
  }
  isDeadlinePassed(deadline: string | Date): boolean {
    const today = new Date();
    const deadLineDate = new Date(deadline);
    return deadLineDate < today;
  }

}