import { Routes, RouterModule } from "@angular/router";
import { ProductRegisterComponent } from "./pages/products/product-register/product-register.component";
import { ClientRegisterComponent } from "./pages/clients/client-register/client-register.component";
import { LoginComponent } from "./pages/login/login.component";
import { authGuard } from "./guards/auth.guard";
import { SidenavComponent } from "./components/sidenav/sidenav.component";
import { EmployeeRegisterComponent } from "./pages/employee/employee-register/employee-register.component";
import { EmployeeListComponent } from "./pages/employee/employee-list/employee-list.component";
import { ClientListComponent } from "./pages/clients/client-list/client-list.component";
import { ProductListComponent } from "./pages/products/product-list/product-list.component";
import { CategoryRegisterComponent } from "./pages/category/category-register/category-register.component";
import { CategoryListComponent } from "./pages/category/category-list/category-list.component";
import { SupplierRegisterComponent } from "./pages/supplier/supplier-register/supplier-register.component";
import { SupplierListComponent } from "./pages/supplier/supplier-list/supplier-list.component";
import { SaleRegisterComponent } from "./pages/sale/sale-register/sale-register.component";
import { SaleListComponent } from "./pages/sale/sale-list/sale-list.component";
import { InvoiceRegisterComponent } from "./pages/invoice/invoice-register/invoice-register.component";
import { InvoiceListComponent } from "./pages/invoice/invoice-list/invoice-list.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";

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
        component: DashboardComponent,
      },
      {
        path: "product/register",
        canActivate: [authGuard],
        component: ProductRegisterComponent,
      },
      {
        path: "product/list",
        canActivate: [authGuard],
        component: ProductListComponent,
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
      {
        path: "category/register",
        component: CategoryRegisterComponent,
      },
      {
        path: "category/list",
        component: CategoryListComponent,
      },
      {
        path: "supplier/register",
        component: SupplierRegisterComponent,
      },
      {
        path: "supplier/list",
        component: SupplierListComponent,
      },
      {
        path: "sale/register",
        component: SaleRegisterComponent,
      },
      {
        path: "sale/list",
        component: SaleListComponent,
      },
      {
        path: "invoice/register",
        component: InvoiceRegisterComponent,
      },
      {
        path: "invoice/list",
        component: InvoiceListComponent,
      },
    ],
  },
];

RouterModule.forRoot(routes, { useHash: true });
