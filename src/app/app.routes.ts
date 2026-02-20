import { Routes } from "@angular/router";
import { LoginComponent } from "./auth/login/login";
import { Navbar } from "./shared/components/navbar/navbar";
import { authGuard } from "./core/guards/auth-guard";
import { Dashboard } from "./features/dashboard/dashboard";
import { Books } from "./features/books/books";
import { Readers } from "./features/readers/readers";
import { Issue } from "./features/issue/issue";
import { Received } from "./features/received/received";
import {PageNotFound} from './shared/page-not-found/page-not-found'

export const routes: Routes = [ 
  { path: 'login', component: LoginComponent },  

  {  
    path: '',
    component: Navbar,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'books', component: Books },
      { path: 'readers', component: Readers }, 
      { path: 'issue', component: Issue }, 
      { path: 'received', component: Received },
    ] 
  }, 

  { path: '**', component: PageNotFound }
];
