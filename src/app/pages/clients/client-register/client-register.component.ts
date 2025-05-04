import { Address } from "./../../../models/address";
import { Component } from "@angular/core";
import {
  FormBuilder,
  FormControl,
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
import { ModalMessageService } from "../../../services/modal-message.service";
import { SharedService } from "../../../shared/services/shared.service";

@Component({
    selector: "app-client-register",
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
    ]
})
export class ClientRegisterComponent {
  clientForm: FormGroup = new FormGroup({});
  idUserLogged: any;
  isEditing: boolean = false;
  clientId: string = "";
  clientToEdit!: Client;
  // cpfControl = new FormControl('');;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: ModalMessageService,
    private sharedService: SharedService
  ) {}

  get cpf(){
    return this.clientForm.get('cpf') as FormControl;
  }

  ngOnInit() {
    this.idUserLogged = this.authService.getLoggedUser();
    this.initializeForm();
    this.recoverIdToEdit();
    this.handleChangeCPF();
  }

  onSubmit() {
    console.log("Form submitted: ", this.clientForm.value);
    if (this.clientForm.valid) {
      if (this.isEditing) {
        const updatedClient = {
          ...this.clientToEdit,
          ...this.clientForm.value,
        };

        this.updateClient(updatedClient);
      } else {
        this.createClient();
      }
    } else {
      this.modalService.showMessage(
        "Preencha os campos obrigatórios antes de continuar.",
        "alert"
      );
    }
  }

  createClient() {
    const client: Client = this.clientForm.value;

    client.createdByEmployee = this.idUserLogged;

    this.clientService.saveClient(client).subscribe({
      next: () => {
        this.modalService.showMessage(
          "As informações foram salvas.",
          "success"
        );
        this.router.navigate(["/client/list"]);
      },
      error: (error) => {
        this.modalService.showMessage(
          "Algo deu errado. Tente novamente.",
          "error"
        );
        console.error(error);
      },
    });
  }

  updateClient(client: Client) {
    console.log("Product to update: ", client);

    this.clientService.updateClient(client).subscribe({
      next: () => {
        this.modalService.showMessage(
          "As informações foram salvas.",
          "success"
        );
        this.router.navigate(["/client/list"]);
      },
      error: (err) => {
        console.error(err);
        this.modalService.showMessage(
          "Algo deu errado. Tente novamente.",
          "error"
        );
      },
    });
  }

  initializeForm(client?: Client) {
    this.clientForm = this.fb.group({
      name: [client?.name ?? "", Validators.required],
      birthDate: [
        client?.birthDate
          ? this.sharedService.formatDate(client.birthDate)
          : "",
        Validators.required,
      ],
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

  handleChangeCPF(){
    this.cpf.valueChanges.subscribe(value => {
      if(value){
        // this.cpfControl.setValue(this.sharedService.formatCpf(value), { emitEvent: false });
        this.cpf.setValue(this.sharedService.formatCpf(value), { emitEvent: false });
      }
    });
  }
}
