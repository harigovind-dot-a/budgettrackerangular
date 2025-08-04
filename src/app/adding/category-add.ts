import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-add',
  imports: [CommonModule, FormsModule],
  templateUrl: './category-add.html'
})
export class CategoryAdd {
  categoryName: string = '';
  isEditMode: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    const editData = localStorage.getItem('editCategory');
    if (editData) {
      const category = JSON.parse(editData);
      this.categoryName = category.name;
      this.isEditMode = true;
    }
  }
  
  saveCategory() {
    let categories = JSON.parse(localStorage.getItem('categories') || '[]');

    if (this.isEditMode) {
      const oldCategory = JSON.parse(localStorage.getItem('editCategory') || '{}');
      categories = categories.map((c: any) =>
        c.name === oldCategory.name ? { name: this.categoryName } : c
      );
      localStorage.removeItem('editCategory');
    } else {
      categories.push({ name: this.categoryName });
    }
    localStorage.setItem('categories', JSON.stringify(categories));
    this.router.navigate(['/category-list']);
  }

  goBack() {
    localStorage.removeItem('editCategory');
    this.router.navigate(['/category-list']);
  }
}
