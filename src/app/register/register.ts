// src/app/register/register.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Api } from '../services/api'; // <-- use Api service

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessages: string[] = [];

  constructor(private api: Api, private router: Router) {}

  registerUser() {
    this.errorMessages = [];

    if(!this.username || !this.password || !this.email) {
      this.errorMessages.push('Some of the fields given above are EMPTY');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessages.push("The two password fields didn't match.");
      return;
    }

    const payload = {
      username: this.username,
      email: this.email,
      password: this.password,
      password2: this.confirmPassword,
    };

    this.api.registerUser(payload).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const error = err.error;

        if (typeof error === 'object') {
          for (const field in error) {
            if (Array.isArray(error[field])) {
              this.errorMessages.push(...error[field]);
            } else {
              this.errorMessages.push(error[field]);
            }
          }
        } else if (typeof error === 'string') {
          this.errorMessages.push(error);
        } else {
          this.errorMessages.push("Registration failed. Please try again.");
        }
      }
    });
  }
}
