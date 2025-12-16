import { Routes } from '@angular/router';

import { authGuard } from '././guards/auth.guard';
import { authReverseGuard } from '././guards/auth-reverse.guard';

import { NotFound404Component } from '././components/not-found-404/not-found-404.component';

export const routes: Routes = [
  { 
    path: '', redirectTo: '/dashboard', pathMatch: 'full', 
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./../app/components/dashboard/dashboard.component').then(c => c.DashboardComponent), 
  }, 
  {
    path: 'news', 
    loadComponent: () => import('./../app/components/news/news.component').then(c => c.NewsComponent), 
  },
  { 
    path: 'my-profile',
    canActivate: [ authGuard() ],
    loadComponent: () => import('./../app/components/settings-page/settings-page.component').then(c => c.SettingsPageComponent),
  },
  { 
    path: 'mylocations', 
    canActivate: [ authGuard() ],
    loadComponent: () => import('./../app/components/mylocations/mylocations.component').then(c => c.MylocationsComponent), 
  },
  {
    path: 'register',
    canActivate: [ authReverseGuard() ],
    loadComponent: () => import('./../app/components/auth/register/register.component').then(c => c.RegisterComponent),
  },
  {
    path: 'login',
    canActivate: [ authReverseGuard() ],
    loadComponent: () => import('./../app/components/auth/login/login.component').then(c => c.LoginComponent),
  },
  { 
    path: '**', component: NotFound404Component,
  },
];
