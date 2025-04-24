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
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { EmployeeService } from "../../../services/employee.service";
import { Employee } from "../../../models/employee";
import { ModalMessageService } from "../../../services/modal-message.service";
import { MatRadioModule } from "@angular/material/radio";
import { SharedService } from "../../../shared/services/shared.service";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-employee-register",
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
  styleUrls: ["./employee-register.component.css"]
})
export class EmployeeRegisterComponent implements OnInit {
  employeeForm: FormGroup = new FormGroup({});
  isAdminControl: FormControl = new FormControl(false);
  hidePassword: boolean = true;
  cpfControl = new FormControl("");
  cpfIsValid: boolean = true;
  isEditing: boolean = false;
  employeeId!: string;
  employeeToEdit!: Employee;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private modalService: ModalMessageService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.handleIsAdminChange();
    this.handleChangeCPF();
    this.recoverIdToEdit();
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
        name: [employee?.name || "", Validators.required],
        username: [employee?.username || "", Validators.required],
        password: ["", Validators.required],
        confirmPassword: ["", Validators.required],
        cpf: [employee?.cpf || "", [Validators.required]],
        email: [employee?.email || "", [Validators.required, Validators.email]],
        phone: [employee?.phone || "", Validators.required],
        isAdmin: [employee?.isAdmin || false],
        birthDate: [
          employee?.birthDate
            ? this.sharedService.formatDate(employee.birthDate)
            : "",
          Validators.required,
        ],
        address: this.fb.group({
          street: [employee?.address?.street || "", Validators.required],
          number: [employee?.address?.number || "", Validators.required],
          complement: [employee?.address?.complement || ""],
          city: [employee?.address?.city || "", Validators.required],
          state: [employee?.address?.state || "", Validators.required],
          postalCode: [employee?.address?.postalCode || "", Validators.required],
        }),
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      if (this.isEditing) {
        const updatedClient = {
          ...this.employeeToEdit,
          ...this.employeeForm.value,
        };

        this.updateEmployee(updatedClient);
      } else {
        this.createEmployee();
      }
    } else {
      let errorMessage = "Por favor, preencha todos os campos obrigatórios antes de continuar.";

      if (this.cpf?.invalid) {
        errorMessage = "O CPF informado é inválido. Verifique e tente novamente.";
      }

      if (this.passwordsMatchValidator(this.employeeForm)) {
        errorMessage = "As senhas não coincidem. Certifique-se de digitá-las corretamente.";
      }

      this.modalService.showMessage(errorMessage, "alert");
    }
  }

  updateEmployee(employee: Employee) {
    this.employeeService.updateEmployee(employee).subscribe({
      next: () => {
        this.modalService.showMessage(
          "As informações foram salvas.",
          "success"
        );
        this.router.navigate(["/employee/list"]);
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

  createEmployee() {
    const employee: Employee = this.employeeForm.value;

    this.employeeService.saveEmployee(employee).subscribe({
      next: () => {
        this.modalService.showMessage(
          "As informações foram salvas.",
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

    return password && confirmPassword && password !== confirmPassword
      ? { passwordsMismatch: true }
      : null;
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

  // onCpfBlur() {
  //   const cpf = this.cpfControl.value ? this.cpfControl.value : "";
  //   this.cpfIsValid = this.sharedService.validateCpf(cpf);
  // }

  recoverIdToEdit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");
      if (id) {
        this.isEditing = true;
        this.employeeId = id;
        this.loadEmployee();
      } else {
        this.isEditing = false;
      }
    });
  }

  loadEmployee() {
    this.employeeService.getEmployee(this.employeeId).subscribe({
      next: (employee) => {
        this.employeeToEdit = employee;
        this.initializeForm(employee);
        console.log("carregou o funcionario: ", employee);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
