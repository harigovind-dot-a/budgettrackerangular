import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Chart, registerables } from "chart.js";
import { Api } from "../services/api";

Chart.register(...registerables);

@Component({
    selector: 'app-analytics',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './analytics.html'
})

export class Analytics {
    months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    selectedMonth: string = '';
    selectedYear: string = '';
    selectedType: string = 'INCOME';
    errorMessage: string = '';
    chart: Chart | null = null;

    constructor(private api: Api) {}

    getAnalytics() {
        this.errorMessage = "";

        const year = Number(this.selectedYear);
        const monthIndex = this.months.indexOf(this.selectedMonth) + 1;
        const typeValue = this.selectedType === 'INCOME' ? 1 : 2;

        if (!this.selectedMonth || !this.selectedYear || !this.selectedType) {
            this.errorMessage = 'Fields cannot be empty';
            return;
        } else if (year<1900 || year>2200) {
            this.errorMessage = 'Year should be in between 1900 and 2200'
            return;
        }

        this.api.getAnalytics(monthIndex, year, typeValue).subscribe({
            next: (data: any) => {
                if (!data.labels.length) {
                    this.errorMessage = 'No transactions found for the selected month/type.';
                    this.clearChart();
                    return;
                }
                this.errorMessage = '';
                this.renderChart(data.labels, data.data);
            },
            error: () => {
                this.errorMessage = 'Failed to fetch analytics data.';
                this.clearChart();
            }
        });
    }

    renderChart(labels: string[], data: number[]) {
        this.clearChart();
        const ctx = document.getElementById('analyticsChart') as HTMLCanvasElement;
        this.chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels,
                datasets: [{
                    label: this.selectedType,
                    data,
                    borderWidth: 1
                }]
            }
        });
    }
    clearChart() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}