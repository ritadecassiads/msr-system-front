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
  // employeeForm: FormGroup;
  fb = inject(FormBuilder);
  employeeService = inject(EmployeeService);
  router = inject(Router);

  readonly isAdminControl = new FormControl(false);

  public employeeForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
    cpf: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.required, Validators.email]),
    phone: new FormControl("", [Validators.required]),
    isAdmin: new FormControl(false, [Validators.required]),
    address: new FormGroup({
      street: new FormControl("", [Validators.required]),
      number: new FormControl("", [Validators.required]),
      complement: new FormControl(""),
      city: new FormControl("", [Validators.required]),
      state: new FormControl("", [Validators.required]),
      postalCode: new FormControl("", [Validators.required]),
    }),
  });

  constructor() {
    // this.employeeForm = this.fb.group({
    //   name: ["", Validators.required],
    //   username: ["", Validators.required],
    //   password: ["", Validators.required],
    //   cpf: ["", Validators.required],
    //   email: ["", [Validators.required, Validators.email]],
    //   phone: ["", Validators.required],
    //   isAdmin: [false], // Checkbox para Administrador
    //   street: ["", Validators.required],
    //   number: ["", Validators.required],
    //   complement: [""],
    //   city: ["", Validators.required],
    //   state: ["", Validators.required],
    //   postalCode: ["", Validators.required],
    // });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      if (this.employeeForm) {
        const employee = this.initForm();

        this.employeeService.saveEmployee(employee).subscribe({
          next: (response) => {
            console.log("Employee registered!", response);
            this.router.navigate(["/dashboard"]);
          },
          error: (error) => {
            console.error("Error registering employee:", error);
            alert("Error registering employee. Please check your data.");
          },
        });
      }
    }
  }

  isAdminChange() {
    // valuesChanges é um Observable e subscribe é usado para reagir a esses eventos
    this.isAdminControl.valueChanges.subscribe((value) => {
      this.employeeForm.get("isAdmin")?.setValue(value);
    });
  }

  initForm() {
    const formValue = this.employeeForm.value;

    const employee: Employee = {
      name: formValue.name ?? "",
      username: formValue.username ?? "",
      password: formValue.password ?? "",
      cpf: formValue.cpf ?? "",
      email: formValue.email ?? "",
      phone: formValue.phone ?? "",
      isAdmin: formValue.isAdmin ?? false,
      address: {
        street: formValue.address?.street ?? "",
        number: formValue.address?.number ?? "",
        complement: formValue.address?.complement ?? "",
        city: formValue.address?.city ?? "",
        state: formValue.address?.state ?? "",
        postalCode: formValue.address?.postalCode ?? "",
      },
    };

    return employee;
  }
}
