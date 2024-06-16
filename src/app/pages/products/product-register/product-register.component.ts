import { Component } from '@angular/core';
import { Product } from '../../../models/products';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
//import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-register',
  standalone: true,
  templateUrl: './product-register.component.html',
  styleUrl: './product-register.component.css',
  imports: [
    MatFormFieldModule, 
    FormsModule, 
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class ProductRegisterComponent {

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  product: Product = {
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    createdAt: new Date()
  };

}
