import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {
  isSidebarVisible = false;
  screenWidth = window.innerWidth;

  constructor(private router:Router) {
    this.isSidebarVisible = !this.isMobileView();
  }

  onHamburgerClick(event: MouseEvent) {
    event.stopPropagation();
    this.toggleSidebar();
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  closeSidebar() {
    if (this.isMobileView()) {
      this.isSidebarVisible = false;
    }
  }

  closeSidebarIfMobile(): void {
     if (this.isMobileView()){
      this.isSidebarVisible = false;
     }
  }

  isMobileView(): boolean {
    return window.innerWidth < 768;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = event.target.innerWidth;
    if (!this.isMobileView()) {
      this.isSidebarVisible = true;
    }
  }

  logout() {
    sessionStorage.removeItem('access');
    sessionStorage.removeItem('refresh');
    this.router.navigate(['/login']);
  }
}
