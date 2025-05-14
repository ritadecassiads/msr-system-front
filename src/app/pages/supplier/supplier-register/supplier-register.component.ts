import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { SupplierService } from "../../../services/supplier.service";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Supplier } from "../../../models/supplier";
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from "@angular/material/card";
import { CommonModule } from "@angular/common";
import { ModalMessageService } from "../../../services/modal-message.service";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { MatIconModule } from "@angular/material/icon";
import { NgxMaskDirective } from "ngx-mask";

@Component({
  selector: "app-supplier-register",
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
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    MatCheckboxModule,
    MatRadioModule,
    MatIconModule,
    NgxMaskDirective

  ],
  templateUrl: "./supplier-register.component.html",
  styleUrl: "./supplier-register.component.css"
})
export class SupplierRegisterComponent implements OnInit {
  supplierForm: FormGroup = new FormGroup({});
  supplierToEdit!: Supplier;
  isEditing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private supplierService: SupplierService,
    private router: Router,
    private modalService: ModalMessageService,
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.formInit();
    this.recoverIdToEdit();
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
        number: [""],
        complement: [""],
        city: ["", Validators.required],
        state: ["", Validators.required],
        postalCode: ["", Validators.required],
      }),
    });
  }

  recoverIdToEdit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");
      if (id) {
        this.isEditing = true;
        this.loadSupplier(id);
      } else {
        this.isEditing = false;
      }
    });
  }

  loadSupplier(id: string): void {
    this.supplierService.getSupplier(id).subscribe((supplier: Supplier) => {
      this.supplierToEdit = supplier;
      this.supplierForm.patchValue(supplier);
    });
  }


  onSubmit() {
    if (this.supplierForm.valid) {
      const supplier: Supplier = this.supplierForm.value;

      if (this.isEditing) {
        const updatedSupplier: Supplier = {
          ...this.supplierToEdit,
          ...supplier,
        }

        this.updateSupplier(updatedSupplier);
      } else {
        this.createSupplier(supplier);
      }
    } else {
      this.modalService.showMessage("Por favor, preencha todos os campos obrigatórios antes de continuar.", "alert");
    }
  }

  createSupplier(supplier: Supplier) {
    this.supplierService.saveSupplier(supplier).subscribe({
      next: () => {
        this.modalService.showMessage('As informações foram salvas.', 'success');
        this.router.navigate(["/supplier/list"]);
      },
      error: (error) => {
        this.modalService.showMessage('Algo deu errado. Tente novamente.', 'error');
      },
    });
  }

  updateSupplier(supplier: Supplier) {
    this.supplierService.updateSupplier(supplier).subscribe({
      next: () => {
        this.modalService.showMessage('As informações foram atualizadas.', 'success');
        this.router.navigate(["/supplier/list"]);
      },
      error: (error) => {
        this.modalService.showMessage('Algo deu errado. Tente novamente.', 'error');
      },
    });
  }
}
