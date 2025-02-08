import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { SupplierService } from "../../../services/supplier.service";
import { Router, RouterModule } from "@angular/router";
import { Supplier } from "../../../models/supplier";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { CommonModule } from "@angular/common";
import { ModalMessageService } from "../../../services/modal-message.service";

@Component({
  selector: "app-supplier-register",
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    CommonModule,
  ],
  templateUrl: "./supplier-register.component.html",
  styleUrl: "./supplier-register.component.css",
})
export class SupplierRegisterComponent implements OnInit {
  supplierForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private router: Router,
    private modalService: ModalMessageService
  ) {}

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.supplierForm = this.fb.group({
      name: ["", Validators.required],
      cnpj: ["", Validators.required],
      phone: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      contactPerson: [""],
      notes: [""],
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
    if (this.supplierForm.valid) {
      const supplier: Supplier = this.supplierForm.value;
      console.log(supplier);

      this.supplierService.saveSupplier(supplier).subscribe({
        next: () => {
          this.modalService.showMessage('As informações foram registradas.', 'success');
          this.router.navigate(["/dashboard"]);
        },
        error: (error) => {
          this.modalService.showMessage('Algo deu errado. Tente novamente.', 'error');
        },
      });
    }
  }
}
