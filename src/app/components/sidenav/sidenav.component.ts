import { Component, inject, viewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { CommonModule } from "@angular/common";
import { MenuComponent } from "../menu/menu.component";
import { ProductRegisterComponent } from "../../pages/products/product-register/product-register.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { Router, RouterLink, RouterOutlet } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { LoginComponent } from "../../pages/login/login.component";
import { MatMenuModule, MatMenuPanel, MatMenuTrigger } from "@angular/material/menu";
import { DialogComponent } from "../dialog/dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { SharedService } from "../../shared/services/shared.service";

@Component({
  selector: "app-sidenav",
  standalone: true,
  templateUrl: "./sidenav.component.html",
  styleUrl: "./sidenav.component.css",
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MenuComponent,
    ProductRegisterComponent,
    MatToolbarModule,
    MatListModule,
    RouterOutlet,
    RouterLink,
    CommonModule,
    LoginComponent,
    MatMenuModule,
    MatIcon,
    DialogComponent,
  ],
})
export class SidenavComponent {
  authService = inject(AuthService);
  router = inject(Router);

  readonly menuTrigger = viewChild.required(MatMenuTrigger);
  readonly dialog = inject(MatDialog);

  constructor(private sharedService: SharedService) {
  }

  isLoggedIn = this.authService.isLoggedIn();

  logout() {
    this.authService.logout();
    this.router.navigate(["/"]);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      restoreFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("Username salvo:", result);
        this.sharedService.setUsername(result);
        this.router.navigate(["/sale/register"]);
      }
    });
  }
}
