import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-add',
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

  constructor(private router: Router) {}

  ngOnInit() {
    this.categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const editTx = localStorage.getItem('editTransaction');
    if (editTx) {
      this.transaction = JSON.parse(editTx);
      this.isEditMode = true;
    }
  }

  saveTransaction() {
    let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');

    if (this.isEditMode) {
      const old = JSON.parse(localStorage.getItem('editTransaction') || '{}');
      transactions = transactions.map((t: any) =>
        t === old ? this.transaction : t
      );
      localStorage.removeItem('editTransaction');
    } else {
      transactions.push(this.transaction);
    }

    localStorage.setItem('transactions', JSON.stringify(transactions));
    this.router.navigate(['/transaction-list']);
  }

  goBack() {
    this.router.navigate(['/transaction-list']);
  }
}
