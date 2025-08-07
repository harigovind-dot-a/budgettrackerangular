import { Routes } from '@angular/router';
import { CategoryAdd } from './adding/category-add';
import { CategoryList } from './listing/category-list';
import { TransactionAdd } from './adding/transaction-add';
import { TransactionList } from './listing/transaction-list';
import { BudgetAdd } from './adding/budget-add';
import { BudgetList } from './listing/budget-list';
import { Summary } from './summary/summary';
import { Analytics } from './analytics/analytics';
import { Login } from './login/login';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { Register } from './register/register';
import { authGuard } from './auth/auth-guard';
import { Landing } from './landing/landing';

export const routes: Routes = [
    {
        path: '', redirectTo: 'login', pathMatch: 'full'
    },
    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            { path: 'landingpage', component: Landing },
            {path: 'category-add', component: CategoryAdd},
            {path: 'category-list', component: CategoryList},
            {path: 'transaction-add', component: TransactionAdd},
            {path: 'transaction-list', component: TransactionList},
            {path: 'budget-add', component: BudgetAdd},
            {path: 'budget-list', component: BudgetList},
            {path: 'summary', component: Summary},
            {path: 'analytics', component: Analytics}
        ]
    },
    {
        path: '',
        component: AuthLayout,
         children: [
            {path: 'login', component: Login},
            {path: 'register', component: Register}
         ]
    }
]
