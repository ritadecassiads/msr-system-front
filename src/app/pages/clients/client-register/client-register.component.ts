import { Address } from './../../../models/address';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Client } from '../../../models/client';

@Component({
  selector: 'app-client-register',
  standalone: true,
  templateUrl: './client-register.component.html',
  styleUrl: './client-register.component.css',
  imports: [    
    MatFormFieldModule, 
    FormsModule, 
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class ClientRegisterComponent {
  client: Client = {
    name: "",
    birthDate: new Date(),
    cpf: "",
    rg: "",
    address: {
      street: "",
      number: "",
      city: "",
      state: "",
      postalCode: ""
    },
    phone: "",
    createdByUser: undefined
  }
  
}
