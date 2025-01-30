import { Address } from "./../../../models/address";
import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { Client } from "../../../models/client";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from "@angular/material/card";
import { EmployeeService } from "../../../services/employee.service";
import { ClientService } from "../../../services/client.service";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-client-register",
  standalone: true,
  templateUrl: "./client-register.component.html",
  styleUrl: "./client-register.component.css",
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class ClientRegisterComponent {
  clientForm: FormGroup;
  idUserLogged: any;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private authService: AuthService,
    private router: Router
  ) {
    this.clientForm = this.fb.group({
      name: "",
      birthDate: "",
      cpf: "",
      rg: "",
      phone: "",
      email: "",
      purchaseLimit: 10000,
      notes: "",
      createdByEmployee: "", // fazer logica para pegar o usuario logado
      fathersName: "",
      mothersName: "",
      peopleAuthorized: "",
      address: this.fb.group({
        street: "",
        number: "",
        complement: "",
        city: "",
        state: "",
        postalCode: "",
      }),
    });
  }

  ngOnInit() {
    this.idUserLogged = this.authService.getLoggedUser();
  }

  onSubmit() {
    this.handleInvalidForm();

    if (this.clientForm.valid) {
      const client: Client = this.clientForm.value;

      client.createdByEmployee = this.idUserLogged;

      console.log("cliente ---> ", client);

      this.clientService.saveClient(client).subscribe({
        next: () => {
          alert("Cliente cadastrado com sucesso!");
          this.router.navigate(["/dashboard"]);
        },
        error: (error) => {
          alert("Erro ao cadastrar cliente!");
          console.error(error);
        },
      });
    }
  }

  handleInvalidForm() {
    if (this.clientForm.invalid) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    // if (filterValue === "") {
    //   this.dataSource.data = this.productList;
    // } else {
    //   const filterValueNumber = Number(filterValue);
    //   this.dataSource.data = this.productList.filter((product) => {
    //     const matchesName = product.name.toLowerCase().includes(filterValue);
    //     const matchesCode =
    //       !isNaN(filterValueNumber) &&
    //       product.code?.toString().includes(filterValue);
    //     return matchesName || matchesCode;
    //   });
    // }
  }
}
