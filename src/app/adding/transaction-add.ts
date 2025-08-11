import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../services/api';

@Component({
  selector: 'app-transaction-add',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './transaction-add.html'
})
export class TransactionAdd implements OnInit {
  transaction: any = {
    date: '',
    category: '',
    type: '',
    amount: null,
    description: ''
  };
  errorMessage: string = '';
  categories: any[] = [];
  isEditMode: boolean = false;

  constructor(private router: Router, private api: Api, private route: ActivatedRoute) {}

  ngOnInit() {
    this.api.getAllCategories().subscribe({
      next: (data: any) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      }
    });
    this.route.queryParams.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.isEditMode = true;
        this.api.getTransactions(id).subscribe({
          next: data => this.transaction = data,
          error: () => this.isEditMode = false
        });
      }
    });
  }

  saveTransaction() {
    this.errorMessage = "";

    const date = new Date(this.transaction.date);
    const minDate = new Date('1900-01-01');
    const maxDate = new Date('2199-12-31');
    if (!this.transaction.date || !this.transaction.category || !this.transaction.type || !this.transaction.amount) {
      this.errorMessage = 'Fields except optional cannot be empty.';
      return;
    } else if (this.transaction.amount < 0.01) {
      this.errorMessage = 'Enter a valid amount greater than 0.01';
      return;
    } else if (date < minDate || date > maxDate) {
      this.errorMessage = 'Enter a valid date between 01-01-1900 and 12-31-2199.';
      return;
    }

    const tr = {
      ...this.transaction,
      category: Number(this.transaction.category),
      type: Number(this.transaction.type)
    };

    if (this.isEditMode && this.transaction.id) {
      this.api.updateTransaction(this.transaction.id, tr).subscribe({
        next: () => {
          this.router.navigate(['/transaction-list']);
        },
        error: (err) => this.errorMessage = 'Update Failed'
      });
    } else {
      this.api.addTransaction(tr).subscribe({
        next: () => this.router.navigate(['/transaction-list']),
        error: (err) => this.errorMessage = 'Add Failed'
      });
    }
  }

  goBack() {
    this.router.navigate(['/transaction-list']);
  }
}
