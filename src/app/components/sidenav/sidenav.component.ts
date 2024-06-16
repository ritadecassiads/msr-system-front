import { Component, inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import { ToolbarComponent } from "../toolbar/toolbar.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { ProductRegisterComponent } from "../../pages/products/product-register/product-register.component";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { LoginComponent } from "../../pages/auth/login/login.component";

@Component({
    selector: 'app-sidenav',
    standalone: true,
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.css',
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
        LoginComponent
    ]
})
export class SidenavComponent {
  authService = inject(AuthService);
  router = inject(Router);
  
  isLoggedIn = this.authService.isLoggedIn();

  logout(){
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
