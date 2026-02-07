// navbar.ts
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive,RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';   

@Component({
  selector: 'app-navbar',
  standalone: true, // Check karo aa che ke nahi
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet], // Ahiya add karo
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isMenuOpen = false;

  constructor(private router: Router) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}