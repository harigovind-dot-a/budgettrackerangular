import { Routes } from '@angular/router';
import { CategoryAdd } from './adding/category-add';
import { CategoryList } from './listing/category-list';
import { TransactionAdd } from './adding/transaction-add';
import { TransactionList } from './listing/transaction-list';
import { BudgetAdd } from './adding/budget-add';
import { BudgetList } from './listing/budget-list';
import { Summary } from './summary/summary';
import { Analytics } from './analytics/analytics';

export const routes: Routes = [
    {path: 'category-add', component: CategoryAdd},
    {path: 'category-list', component: CategoryList},
    {path: 'transaction-add', component: TransactionAdd},
    {path: 'transaction-list', component: TransactionList},
    {path: 'budget-add', component: BudgetAdd},
    {path: 'budget-list', component: BudgetList},
    {path: 'summary', component: Summary},
    {path: 'analytics', component: Analytics}
];
