import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api-service';
import { Footer } from '../../DashBoardmaterials/footer/footer';
import { Header } from '../../DashBoardmaterials/header/header';
import { Sidebar } from '../../DashBoardmaterials/sidebar/sidebar';

declare let toastr: any;

@Component({
  selector: 'app-submissions',
  imports: [Header, Sidebar, Footer, CommonModule, FormsModule],
  templateUrl: './submissions.html',
  styleUrl: './submissions.scss'
})
export class Submissions {
  applications: any[] = [];
  loading = false;
  searchTerm: string = '';
  isNegativeNumber: boolean = false;
  inviteLoading = false;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.fetchApplications();
    toastr.options = {
      closeButton: true,
      progressBar: true,
      positionClass: "toast-top-right",
      timeOut: 3000
    };
  }
  validateSearchTerm() {
    const trimmed = this.searchTerm.trim();
    const num = Number(trimmed);


    if (!isNaN(num) && num < 0) {
      this.isNegativeNumber = true;
      toastr.warning('Negative numbers are ignored in search', 'Warning');
    } else {
      this.isNegativeNumber = false;
    }
  }
  fetchApplications() {
    this.loading = true;

    let jobId: number | undefined;
    let jobTitle: string | undefined;

    const trimmed = this.searchTerm.trim();
    if (trimmed) {
      const num = Number(trimmed);
      if (!isNaN(num) && num > 0) {
        jobId = num;
      } else if (num < 0) {
        jobId = undefined;
      } else {
        jobTitle = trimmed;
      }
    }
    this.api.GetAllSubmission(jobId, jobTitle).subscribe({
      next: (res) => {
        this.applications = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching applications', err);
        this.applications = [];
        toastr.error('Failed to fetch applications', 'Error');
        this.loading = false;
      }
    });
  }

  filterApplications() {
    this.fetchApplications();
  }


  downloadResume(userId: number, fullName: string) {
    this.api.downloadResume(userId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fullName}_resume.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        toastr.success(`Resume downloaded for ${fullName}`, 'Success');
      },
      error: (err) => {
        console.error('Error downloading resume', err);
        toastr.error('Failed to download resume', 'Error');
      }
    });
  }


  updateStatus(applicationId: number, newStatus: number) {
    this.inviteLoading = true;
    this.api.updateTheStatus(applicationId, newStatus).subscribe({
      next: () => {
        toastr.success('Invite Sent successfully!', 'Success');
        this.fetchApplications();
        this.inviteLoading = false;
      },
      error: (err) => {
        console.error('Error updating status', err);
        toastr.error('Failed to Invite ', 'Error');
        this.inviteLoading = false;
      }
    });
  }
}