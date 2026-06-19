import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, DatePipe],
  templateUrl: './rewards.component.html',
  styleUrl: './rewards.component.css'
})
export class RewardsComponent implements OnInit {
  totalPoints: number = 0;
  rewardHistory: any[] = [];
  isLoading: boolean = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadRewards();
  }

  loadRewards() {
    this.isLoading = true;

    // Load summary
    this.api.getRewardSummary().subscribe({
      next: (data: any) => {
        this.totalPoints = data.totalPoints || 0;
      },
      error: () => {
        this.totalPoints = 0;
      }
    });

    // Load history
    this.api.getRewardHistory().subscribe({
      next: (data: any[]) => {
        this.rewardHistory = (data || []).sort((a: any, b: any) =>
          new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
        );
        this.isLoading = false;
      },
      error: () => {
        this.rewardHistory = [];
        this.isLoading = false;
      }
    });
  }

  getShortTransactionId(id: string): string {
    if (!id) return 'N/A';
    return id.length > 8 ? id.substring(0, 8).toUpperCase() : id.toUpperCase();
  }
}
