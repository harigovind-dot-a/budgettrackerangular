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
        this.errorMessage = "";
        const yearNum = Number(this.selectedYear);
        const monthIndex = this.months.indexOf(this.selectedMonth) + 1;

        if(!this.selectedMonth || !this.selectedYear){
            this.errorMessage = 'Field cannot be empty';
            return;
        } else if (yearNum < 1900 || yearNum > 2200) {
            this.errorMessage = 'Year should be in between 1900 and 2200';
            return;
        }

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
    downloadCSV() {
        if (!this.summaryData) return;
        const data = this.summaryData;
        const csvRows = [
            ['Month and Year', data['month and year']],
            ['Budget', data.budget_amount],
            ['Total Income', data.income_total],
            ['Total Expense', data.expense_total],
            ['Net Savings', data.net_savings],
            ['Remaining Budget', data.remaining_budget]
        ];
        const csv = csvRows.map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `summary-${data['month and year']}.csv`;
        a.click();
        window.URL.revokeObjectURL(a.href);
    }
}