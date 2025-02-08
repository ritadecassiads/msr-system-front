import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
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

@Component({
  selector: "app-employee-register",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatToolbar,
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
  ],
  templateUrl: "./employee-register.component.html",
  styleUrls: ["./employee-register.component.css"],
})
export class EmployeeRegisterComponent {
  employeeForm: FormGroup;
  isAdminControl: FormControl = new FormControl(false);

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private modalService: ModalMessageService
  ) {
    this.employeeForm = this.fb.group({
      name: ["", Validators.required],
      username: ["", Validators.required],
      password: ["", Validators.required],
      cpf: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", Validators.required],
      isAdmin: [false],
      address: this.fb.group({
        street: ["", Validators.required],
        number: ["", Validators.required],
        complement: [""],
        city: ["", Validators.required],
        state: ["", Validators.required],
        postalCode: ["", Validators.required],
      }),
    });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const employee: Employee = this.employeeForm.value;

      this.employeeService.saveEmployee(employee).subscribe({
        next: () => {
          this.modalService.showMessage('As informações foram registradas.', 'success');
          this.router.navigate(["/dashboard"]);
        },
        error: (error) => {
          console.error("Error registering employee:", error);
          this.modalService.showMessage('Algo deu errado. Tente novamente.', 'error');
        },
      });
    } else {
      this.modalService.showMessage('Preencha os campos obrigatórios antes de continuar.', 'validation');
    }
  }

  isAdminChange() {
    // valuesChanges é um Observable e subscribe é usado para reagir a esses eventos
    this.isAdminControl.valueChanges.subscribe((value: boolean) => {
      this.employeeForm.get("isAdmin")?.setValue(value);
      console.log("isAdminControl value: ", value);
    });
  }
}
