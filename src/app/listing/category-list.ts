import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-list',
  imports: [RouterLink],
  templateUrl: './category-list.html'
})
export class CategoryList {
  categories: { name: string }[] = [];
  dropdownOpen: any = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    const data = localStorage.getItem('categories');
    this.categories = data ? JSON.parse(data) : [];
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
    localStorage.setItem('editCategory', JSON.stringify(category));
    this.router.navigate(['/category-add']);
  }

  deleteCategory(category: any) {
    this.categories = this.categories.filter(c => c.name !== category.name);
    localStorage.setItem('categories', JSON.stringify(this.categories));
  }
}
