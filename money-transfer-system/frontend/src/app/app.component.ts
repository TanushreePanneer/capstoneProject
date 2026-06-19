import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { ApiService } from './services/api.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  showProfileDropdown = false;
  username: string = '';
  currentRoute: string = '';

  constructor(
    public authService: AuthService,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects || event.url;
      this.showProfileDropdown = false;
      // Fetch username when navigating to authenticated pages
      if (this.authService.isLoggedIn() && !this.username) {
        this.loadUsername();
      }
    });

    if (this.authService.isLoggedIn()) {
      this.loadUsername();
    }
  }

  loadUsername() {
    this.api.getAccount().subscribe({
      next: (account: any) => {
        if (account) {
          this.username = account.holderName || account.username || 'User';
        }
      },
      error: () => {
        this.username = 'User';
      }
    });
  }

  toggleProfileDropdown(event: Event) {
    event.stopPropagation();
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    this.showProfileDropdown = false;
  }

  logout() {
    this.showProfileDropdown = false;
    this.username = '';
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get isAuthPage(): boolean {
    return this.currentRoute === '/login' || this.currentRoute === '/register';
  }

  get navActionLabel(): string {
    if (this.currentRoute === '/transfer') {
      return 'Cancel';
    }
    return 'Back to Dashboard';
  }

  get showNavAction(): boolean {
    return ['/transfer', '/history', '/analytics', '/rewards'].includes(this.currentRoute);
  }
}
