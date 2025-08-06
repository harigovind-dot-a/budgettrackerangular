import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Api } from "../services/api";

@Component({
    selector: 'app-summary',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './summary.html'
})

export class Summary {
    months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    selectedMonth: string = '';
    selectedYear: string = '';
    summaryData: any = null;
    errorMessage: string = '';

    constructor(private api: Api) {}

    getSummary() {
        const yearNum = Number(this.selectedYear);
        const monthIndex = this.months.indexOf(this.selectedMonth) + 1;
        this.api.getBudgetSummary(monthIndex, yearNum).subscribe({
            next: (data) => {
                this.summaryData = data;
                this.errorMessage = '';
            },
            error: () => {
                this.summaryData = null;
                this.errorMessage = 'No budget found for selected month/year.';
            }
        });
    }
}