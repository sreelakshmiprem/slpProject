import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../../api-service';
import { Footer } from '../../DashBoardmaterials/footer/footer';
import { Header } from '../../DashBoardmaterials/header/header';
import { Sidebar } from '../../DashBoardmaterials/sidebar/sidebar';
import { DecodeAuth } from '../../decode-auth';

declare let toastr: any;

@Component({
  selector: 'app-applied-jobs',
  imports: [CommonModule, Header, Sidebar, Footer],
  templateUrl: './applied-jobs.html',
  styleUrl: './applied-jobs.scss'
})
export class AppliedJobs {
  appliedJobs: any[] = [];
  userId: number | null = null;
  loading = true;
  errorMessage = '';

  constructor(private api: ApiService, private auth: DecodeAuth) { }

  ngOnInit(): void {
    this.userId = Number(this.auth.currentUser.userId);

    if (this.userId) {
      this.api.UserAppliedJobs(this.userId).subscribe({
        next: (res) => {
          this.appliedJobs = res;
          this.loading = false;
        },
        error: () => {

          toastr.error('Failed to load applied jobs.', 'Error');
          this.loading = false;
        }
      });
    } else {
      toastr.warning('User not logged in.', 'Warning');
      this.loading = false;
    }
    toastr.options = {
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-top-right',
      timeOut: 3000
    };
  }


  //   getJobAt(index: number) {
  //     return this.appliedJobs[index];
  //   }
}
