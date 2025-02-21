import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from "@angular/material/card";
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatToolbar } from "@angular/material/toolbar";
import { Router, RouterModule } from "@angular/router";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { EmployeeService } from "../../../services/employee.service";
import { Employee } from "../../../models/employee";
import { ModalMessageService } from "../../../services/modal-message.service";
import { MatRadioModule } from "@angular/material/radio";
import { SharedService } from "../../../shared/services/shared.service";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-employee-register",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatCard,
    MatButtonModule,
    MatSlideToggleModule,
    FormsModule,
    CommonModule,
    MatLabel,
    MatFormField,
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatCardSubtitle,
    MatIconModule,
  ],
  templateUrl: "./employee-register.component.html",
  styleUrls: ["./employee-register.component.css"],
})
export class EmployeeRegisterComponent implements OnInit {
  employeeForm: FormGroup = new FormGroup({});
  isAdminControl: FormControl = new FormControl(false);
  hidePassword: boolean = true;
  cpfControl = new FormControl("");
  cpfIsValid: boolean = true;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private modalService: ModalMessageService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.handleIsAdminChange();
    this.handleChangeCPF();
  }

  get isAdmin() {
    return this.employeeForm.get("isAdmin");
  }

  get password() {
    return this.employeeForm.get("password");
  }

  get confirmPassword() {
    return this.employeeForm.get("confirmPassword");
  }

  get cpf() {
    return this.employeeForm.get("cpf");
  }

  initializeForm(employee?: Employee) {
    this.employeeForm = this.fb.group(
      {
        name: ["", Validators.required],
        username: ["", Validators.required],
        password: ["", Validators.required],
        confirmPassword: ["", Validators.required],
        cpf: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
        email: ["", [Validators.required, Validators.email]],
        phone: ["", Validators.required],
        isAdmin: [false],
        birthDate: [
          employee?.birthDate
            ? this.sharedService.formatDate(employee.birthDate)
            : "",
          Validators.required,
        ],
        address: this.fb.group({
          street: ["", Validators.required],
          number: ["", Validators.required],
          complement: [""],
          city: ["", Validators.required],
          state: ["", Validators.required],
          postalCode: ["", Validators.required],
        }),
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const employee: Employee = this.employeeForm.value;

      this.employeeService.saveEmployee(employee).subscribe({
        next: () => {
          this.modalService.showMessage(
            "As informações foram registradas.",
            "success"
          );
          this.router.navigate(["/dashboard"]);
        },
        error: (error) => {
          console.error("Error registering employee:", error);
          this.modalService.showMessage(
            "Algo deu errado. Tente novamente.",
            "error"
          );
        },
      });
    } else {
      this.modalService.showMessage(
        "Preencha os campos obrigatórios antes de continuar.",
        "alert"
      );
    }
  }

  handleIsAdminChange() {
    this.isAdminControl.valueChanges.subscribe((value: string) => {
      this.isAdmin?.setValue(value);
    });
  }

  handleChangeCPF() {
    this.cpfControl.valueChanges.subscribe((value) => {
      if (value) {
        this.cpfControl.setValue(this.sharedService.formatCpf(value), {
          emitEvent: false,
        });
      }
    });
  }

  passwordsMatchValidator: ValidatorFn = (
    formGroup: AbstractControl
  ): ValidationErrors | null => {
    const password = formGroup.get("password")?.value;
    const confirmPassword = formGroup.get("confirmPassword")?.value;

    console.log("password e confirmPassword: ", password, confirmPassword);

    return password && confirmPassword && password !== confirmPassword
      ? { passwordsMismatch: true } // Retorna um erro caso as senhas não coincidam
      : null; // Retorna null se estiver tudo certo
  };

  openModalAdminConfirm() {
    this.modalService.showMessage(
      "Você está prestes a criar um usuário administrador. Deseja continuar?",
      "alert",
      "Continuar"
    );
  }

  togglePasswordVisibility(event: MouseEvent) {
    this.hidePassword = !this.hidePassword;
    event.stopPropagation();
  }

  onCpfBlur() {
    const cpf = this.cpfControl.value ? this.cpfControl.value : "";
    this.cpfIsValid = this.sharedService.validateCpf(cpf);
  }
}
