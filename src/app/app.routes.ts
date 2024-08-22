import { Routes, RouterModule } from "@angular/router";
import { ProductRegisterComponent } from "./pages/products/product-register/product-register.component";
import { ClientRegisterComponent } from "./pages/clients/client-register/client-register.component";
import { LoginComponent } from "./pages/login/login.component";
import { authGuard } from "./guards/auth.guard";
import { SidenavComponent } from "./components/sidenav/sidenav.component";
import { EmployeeRegisterComponent } from "./pages/employee/employee-register/employee-register.component";

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
        path: "employee/register",
        component: EmployeeRegisterComponent,
      },
    ],
  },
  // {
  //   path: "product/register",
  //   canActivate: [authGuard],
  //   component: ProductRegisterComponent,
  // },
  // {
  //   path: "client/register",
  //   canActivate: [authGuard],
  //   component: ClientRegisterComponent,
  // },
];

RouterModule.forRoot(routes, { useHash: true });
