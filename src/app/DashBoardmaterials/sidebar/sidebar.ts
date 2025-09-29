import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../api-service';

interface Menu {
  menuName: string;
  menuPath: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})
export class Sidebar {
  menus: Menu[] = [];
  private menuService = inject(ApiService);
  private router = inject(Router);

  ngOnInit(): void {
    this.menuService.getMyMenus().subscribe(data => this.menus = data);
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}