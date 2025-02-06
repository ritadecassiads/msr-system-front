import { Address } from "./../../../models/address";
import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
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
  MatCardSubtitle,
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
    MatCardSubtitle,
  ],
})
export class ClientRegisterComponent {
  clientForm: FormGroup = new FormGroup({});
  idUserLogged: any;
  isEditing: boolean = false;
  clientId: string = "";
  clientToEdit!: Client;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // this.clientForm = this.fb.group({
    //   name: "",
    //   birthDate: "",
    //   cpf: "",
    //   rg: "",
    //   phone: "",
    //   email: "",
    //   purchaseLimit: 10000,
    //   notes: "",
    //   createdByEmployee: "", // fazer logica para pegar o usuario logado
    //   fathersName: "",
    //   mothersName: "",
    //   peopleAuthorized: "",
    //   address: this.fb.group({
    //     street: "",
    //     number: "",
    //     complement: "",
    //     city: "",
    //     state: "",
    //     postalCode: "",
    //   }),
    // });
  }

  ngOnInit() {
    this.idUserLogged = this.authService.getLoggedUser();
    this.initializeForm();
    this.recoverIdToEdit();
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
          this.router.navigate(["/client/list"]);
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

  initializeForm(client?: Client) {
    this.clientForm = this.fb.group({
      name: [client?.name ?? "", Validators.required],
      birthDate: [client?.birthDate ? this.formatDate(client.birthDate) : "", Validators.required],
      cpf: [client?.cpf || "", Validators.required],
      rg: [client?.rg || ""],
      phone: [client?.phone || "", Validators.required],
      email: [client?.email || "", [Validators.email]],
      purchaseLimit: [client?.purchaseLimit || 10000],
      notes: [client?.notes || ""],
      createdByEmployee: [client?.createdByEmployee || ""], // fazer logica para pegar o usuario logado
      fathersName: [client?.fathersName || ""],
      mothersName: [client?.mothersName || ""],
      peopleAuthorized: [client?.peopleAuthorized || ""],
      address: this.fb.group({
        street: [client?.address?.street || "", Validators.required],
        number: [client?.address?.number || "", Validators.required],
        complement: [client?.address?.complement || ""],
        city: [client?.address?.city || "", Validators.required],
        state: [client?.address?.state || "", Validators.required],
        postalCode: [client?.address?.postalCode || "", Validators.required],
      }),
    });
  }

  recoverIdToEdit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");
      if (id) {
        this.isEditing = true;
        this.clientId = id;
        this.loadClient();
      } else {
        this.isEditing = false;
      }
    });
  }

  loadClient() {
    this.clientService.getClient(this.clientId).subscribe({
      next: (client) => {
        this.clientToEdit = client;
        this.initializeForm(client);

        console.log("carregou o cliente: ", client);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  formatDate(dateString: Date): string {
    console.log("dateString: ", dateString);
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    console.log("date: ", `${day}/${month}/${year}`);
    return `${day}/${month}/${year}`;
  }
}
