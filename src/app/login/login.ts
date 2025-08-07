import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { Api } from "../services/api";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './login.html',
    styleUrl: './login.scss'
})

export class Login {
    username: string = '';
    password: string = '';
    errorMessage: string = '';

    constructor(private api: Api, private router: Router) {}

    loginUser() {
        this.errorMessage = "";
        if(!this.username || !this.password) {
            this.errorMessage = 'Both username and password are required.';
            return;
        }
        const credentials = {
            username: this.username,
            password: this.password
        };
        this.api.login(credentials).subscribe({
            next: (response: any) => {
                sessionStorage.setItem('access', response.access);
                sessionStorage.setItem('refresh', response.refresh);
                this.router.navigate(['/landingpage']);
            },
            error: () => {
                this.errorMessage = 'Invalid username or password.';
            }
        });
    }
}