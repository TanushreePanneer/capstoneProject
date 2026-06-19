import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.css',
})
export class TransferComponent {
  toAccount = '';
  amount: number | null = null;
  successMessage = '';
  errorMessage = '';
  isSubmitting = false;

  constructor(private api: ApiService) {}

  transfer(form: NgForm) {
    this.successMessage = '';
    this.errorMessage = '';
    this.isSubmitting = true;

    this.api.transfer({
      toAccount: this.toAccount,
      amount: this.amount
    }).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        if (res.status === 'SUCCESS') {
          this.successMessage = 'Transfer successful! Funds have been sent.';
          // Reset all form fields to clean initial state
          this.toAccount = '';
          this.amount = null;
          form.resetForm();
        } else {
          this.errorMessage = res.message || 'Transfer could not be completed.';
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Transfer failed. Please try again.';
      }
    });
  }
}
