import { Routes, RouterModule } from "@angular/router";
import { ProductRegisterComponent } from "./pages/products/product-register/product-register.component";
import { ClientRegisterComponent } from "./pages/clients/client-register/client-register.component";
import { LoginComponent } from "./pages/login/login.component";
import { authGuard } from "./guards/auth.guard";
import { SidenavComponent } from "./components/sidenav/sidenav.component";
import { EmployeeRegisterComponent } from "./pages/employee/employee-register/employee-register.component";
import { EmployeeListComponent } from "./pages/employee/employee-list/employee-list.component";
import { ClientListComponent } from "./pages/clients/client-list/client-list.component";

export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full",
  },
  {
    path: "",
    component: SidenavComponent,
    children: [
      {
        path: "dashboard",
        component: ProductRegisterComponent,
      },
      {
        path: "product/register",
        canActivate: [authGuard],
        component: ProductRegisterComponent,
      },
      {
        path: "client/register",
        canActivate: [authGuard],
        component: ClientRegisterComponent,
      },
      {
        path: "client/list",
        canActivate: [authGuard],
        component: ClientListComponent,
      },
      {
        path: "employee/register",
        component: EmployeeRegisterComponent,
      },
      {
        path: "employee/list",
        component: EmployeeListComponent,
      },
    ],
  },
];

RouterModule.forRoot(routes, { useHash: true });
