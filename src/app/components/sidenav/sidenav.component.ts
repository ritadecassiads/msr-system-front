import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import { ToolbarComponent } from "../toolbar/toolbar.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { ProductRegisterComponent } from "../../pages/products/product-register/product-register.component";

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
        ProductRegisterComponent
    ]
})
export class SidenavComponent {
  onSidenavChange(event: boolean) {
    // Check if the sidenav is open
    if (event) {
      console.log('Sidenav opened');
      // Perform actions when sidenav is open (e.g., adjust UI elements)
    } else {
      console.log('Sidenav closed');
      // Perform actions when sidenav is closed (e.g., reset UI elements)
    }
  }
}
