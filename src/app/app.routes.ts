import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { AuthGuard } from "./guards/auth.guard";
import { SidenavComponent } from "./components/sidenav/sidenav.component";

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
    loadComponent: () =>
      import("./components/sidenav/sidenav.component").then(
        (m) => SidenavComponent
      ),
    children: [
      {
        path: "dashboard",
        loadComponent: () =>
          import("./pages/dashboard/dashboard.component").then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: "product/register",
        canActivate: [AuthGuard],
        loadComponent: () =>
          import(
            "./pages/products/product-register/product-register.component"
          ).then((m) => m.ProductRegisterComponent),
      },
      {
        path: "product/list",
        // canActivate: [AuthGuard],
        loadComponent: () =>
          import("./pages/products/product-list/product-list.component").then(
            (m) => m.ProductListComponent
          ),
      },
      {
        path: "product/edit/:id",
        canActivate: [AuthGuard],
        loadComponent: () =>
          import(
            "./pages/products/product-register/product-register.component"
          ).then((m) => m.ProductRegisterComponent),
      },
      {
        path: "client/register",
        loadComponent: () =>
          import(
            "./pages/clients/client-register/client-register.component"
          ).then((m) => m.ClientRegisterComponent),
      },
      {
        path: "client/list",
        canActivate: [AuthGuard],
        loadComponent: () =>
          import("./pages/clients/client-list/client-list.component").then(
            (m) => m.ClientListComponent
          ),
      },
      {
        path: "client/edit/:id",
        canActivate: [AuthGuard],
        loadComponent: () =>
          import(
            "./pages/clients/client-register/client-register.component"
          ).then((m) => m.ClientRegisterComponent),
      },
      {
        path: "employee/register",
        loadComponent: () =>
          import(
            "./pages/employee/employee-register/employee-register.component"
          ).then((m) => m.EmployeeRegisterComponent),
      },
      {
        path: "employee/list",
        loadComponent: () =>
          import("./pages/employee/employee-list/employee-list.component").then(
            (m) => m.EmployeeListComponent
          ),
      },
      {
        path: "employee/edit/:id",
        loadComponent: () =>
          import("./pages/employee/employee-register/employee-register.component").then(
            (m) => m.EmployeeRegisterComponent
          ),
      },

      {
        path: "category/register",
        loadComponent: () =>
          import(
            "./pages/category/category-register/category-register.component"
          ).then((m) => m.CategoryRegisterComponent),
      },
      {
        path: "category/list",
        loadComponent: () =>
          import("./pages/category/category-list/category-list.component").then(
            (m) => m.CategoryListComponent
          ),
      },
      {
        path: "supplier/register",
        loadComponent: () =>
          import(
            "./pages/supplier/supplier-register/supplier-register.component"
          ).then((m) => m.SupplierRegisterComponent),
      },
      {
        path: "supplier/list",
        loadComponent: () =>
          import("./pages/supplier/supplier-list/supplier-list.component").then(
            (m) => m.SupplierListComponent
          ),
      },
      {
        path: "open-sale",
        loadComponent: () =>
          import("./pages/sale/open-sale/open-sale.component").then(
            (m) => m.SaleRegisterComponent
          ),
      },
      {
        path: "sale/list",
        loadComponent: () =>
          import("./pages/sale/sale-list/sale-list.component").then(
            (m) => m.SaleListComponent
          ),
      },
      {
        path: "sale/close/:_id",
        loadComponent: () =>
          import("./pages/sale/close-sale/close-sale.component").then(
            (m) => m.CloseSaleComponent
          ),
      },
      {
        path: "invoice/register",
        loadComponent: () =>
          import(
            "./pages/invoice/invoice-register/invoice-register.component"
          ).then((m) => m.InvoiceRegisterComponent),
      },
      {
        path: "invoice/list",
        loadComponent: () =>
          import("./pages/invoice/invoice-list/invoice-list.component").then(
            (m) => m.InvoiceListComponent
          ),
      },
      {
        path: "invoice/edit/:id",
        loadComponent: () =>
          import(
            "./pages/invoice/invoice-register/invoice-register.component"
          ).then((m) => m.InvoiceRegisterComponent),
      },
    ],
  },
];

RouterModule.forRoot(routes, { useHash: true });
