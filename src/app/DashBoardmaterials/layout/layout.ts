import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterModule, Header, Sidebar, Footer],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {

}
