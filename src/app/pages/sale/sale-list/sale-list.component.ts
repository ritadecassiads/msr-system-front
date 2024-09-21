import { Component } from '@angular/core';
import { MatGridListModule, MatGridTile } from '@angular/material/grid-list';

@Component({
  selector: "app-sale-list",
  standalone: true,
  imports: [MatGridListModule],
  templateUrl: "./sale-list.component.html",
  styleUrl: "./sale-list.component.css",
})
export class SaleListComponent {}
