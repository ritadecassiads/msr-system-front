import { Component, inject, viewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { CommonModule } from "@angular/common";
import { ProductRegisterComponent } from "../../pages/products/product-register/product-register.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { Router, RouterLink, RouterModule, RouterOutlet } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { LoginComponent } from "../../pages/login/login.component";
import { MatMenuModule, MatMenuPanel, MatMenuTrigger } from "@angular/material/menu";
import { InputUserDialogComponent } from "../dialog/input-user-dialog/input-user-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { SharedService } from "../../shared/services/shared.service";
import { LoaderComponent } from "../loader/loader.component";

@Component({
    selector: "app-sidenav",
    templateUrl: "./sidenav.component.html",
    styleUrl: "./sidenav.component.css",
    imports: [
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule,
        MatListModule,
        RouterOutlet,
        RouterLink,
        CommonModule,
        MatMenuModule,
        MatIcon,
        RouterModule,
        LoaderComponent
    ]
})
export class SidenavComponent {
  authService = inject(AuthService);
  isCollapsed = false;
  showFiller = false;

  readonly menuTrigger = viewChild.required(MatMenuTrigger);
  readonly dialog = inject(MatDialog);

  constructor(private sharedService: SharedService, private router: Router) {}

  isLoggedIn = this.authService.isLoggedIn();

  logout() { 
    this.authService.logout();
    this.router.navigate(["/"]);
  }

  toggleSidenav() {
    // sidenav.toggle();
    this.isCollapsed = !this.isCollapsed;
  }
}
