import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../services/api';

@Component({
  selector: 'app-category-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-add.html'
})
export class CategoryAdd implements OnInit{
  categoryName: string = '';
  isEditMode: boolean = false;
  categoryId: number | null = null;

  constructor(private router: Router, private api: Api, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.isEditMode = true;
        this.api.getCategory(id).subscribe({
          next: (data:any) => {
            this.categoryName = data.name;
            this.categoryId = data.id;
          },
          error: () => this.isEditMode = false
        });
      }
    });
  }
  
  saveCategory() {
    const ct = { name: this.categoryName };

    if (this.isEditMode && this.categoryId != null) {
      this.api.updateCategory(this.categoryId, ct).subscribe({
        next: () => {
          this.router.navigate(['/category-list']);
        },
        error: (err) => console.error('Update failed', err)
      });
    } else {
      this.api.addCategory(ct).subscribe({
        next: () => this.router.navigate(['/category-list']),
        error: (err) => console.error('Add failed', err)
      });
    }
  }

  goBack() {
    localStorage.removeItem('editCategory');
    this.router.navigate(['/category-list']);
  }
}
