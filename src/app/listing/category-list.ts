import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Api } from '../services/api';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './category-list.html'
})
export class CategoryList {
  categories: { name: string }[] = [];
  dropdownOpen: any = null;

  constructor(private router: Router, private api: Api) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.api.getAllCategories().subscribe({
      next: (data: any) => this.categories = data.sort((a: any, b: any) => a.name.localeCompare(b.name)),
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  toggleDropdown(category: any) {
    this.dropdownOpen = this.dropdownOpen === category ? null : category;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.list-group-item')) {
      this.dropdownOpen = null;
    }
  }

  editCategory(category: any) {
    this.router.navigate(['/category-add'], { queryParams: { id: category.id } });
  }

  deleteCategory(category: any) {
    const confirmed = confirm(`Do you really want to delete this category?`);
    if (!confirmed) return;
    this.api.deleteCategory(category.id).subscribe({
      next: () => this.loadCategories(),
      error: (err) => console.error('Delete failed', err)
    });
  }
}
