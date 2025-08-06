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
    if (!this.transaction.date || !this.transaction.category || !this.transaction.type || !this.transaction.amount) return;

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
        error: (err) => console.error('Update failed', err)
      });
    } else {
      this.api.addTransaction(tr).subscribe({
        next: () => this.router.navigate(['/transaction-list']),
        error: (err) => console.error('Add failed', err)
      });
    }
  }

  goBack() {
    this.router.navigate(['/transaction-list']);
  }
}
