import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  balance: number = 0;
  balanceVisible: boolean = true;
  totalRewardPoints: number = 0;

  constructor(private api: ApiService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.api.getBalance().subscribe((data: any) => {
      this.balance = data.balance;
    });

    // Load reward summary
    this.api.getRewardSummary().subscribe({
      next: (data: any) => {
        this.totalRewardPoints = data.totalPoints || 0;
      },
      error: () => {
        this.totalRewardPoints = 0;
      }
    });
  }

  toggleBalanceVisibility() {
    this.balanceVisible = !this.balanceVisible;
  }
}
