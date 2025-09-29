import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ApiService } from '../../api-service';
import { Footer } from '../../DashBoardmaterials/footer/footer';
import { Header } from '../../DashBoardmaterials/header/header';
import { Sidebar } from '../../DashBoardmaterials/sidebar/sidebar';

declare let toastr: any;

@Component({
  selector: 'app-locked-accounts',
  imports: [CommonModule, Header, Sidebar, Footer],
  templateUrl: './locked-accounts.html',
  styleUrl: './locked-accounts.scss'
})
export class LockedAccounts {
  lockedAccounts: any[] = [];
  loading = false;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.fetchLockedAccounts();
  }

  fetchLockedAccounts() {
    this.loading = true;
    this.api.getLockedAccounts().subscribe({
      next: (res) => {
        this.lockedAccounts = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching locked accounts', err);
        toastr.error('Failed to fetch locked accounts', 'Error');
        this.loading = false;
      }
    });
  }

  unlock(userName: string) {

    if (!window.confirm(`Are you sure you want to unlock ${userName}?`)) return;

    this.api.unlockAccount(userName).subscribe({
      next: () => {
        toastr.success(`${userName} has been unlocked successfully!`, 'Success');
        this.fetchLockedAccounts();
      },
      error: (err) => {
        console.error('Error unlocking account', err);
        toastr.error('Failed to unlock account', 'Error');
      }
    });
  }
}
