import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
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
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Router, RouterModule } from "@angular/router";
import { InvoiceService } from "../../../services/invoice.service";
import { SupplierService } from "../../../services/supplier.service";
import { Supplier } from "../../../models/supplier";
import { MatOption } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { Invoice } from "../../../models/invoice";

@Component({
  selector: "app-invoice-register",
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
    MatSelectModule,
    MatOption,
    CommonModule,
  ],
  templateUrl: "./invoice-register.component.html",
  styleUrl: "./invoice-register.component.css",
})
export class InvoiceRegisterComponent implements OnInit {
  invoiceForm: FormGroup = new FormGroup({});
  supplierControl = new FormControl("");
  supplierList: Supplier[] = [];

  statusControl = new FormControl("");
  statusList = ["Aberta", "Paga", "Atrasada"];

  constructor(
    private invoiceService: InvoiceService,
    private supplierService: SupplierService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    //this.onChangeSupplierControl();
    //this.onChangeStatusControl();
    this.getSuppliers();
  }

  initForm() {
    this.invoiceForm = this.fb.group({
      amount: ["", Validators.required],
      issueDate: ["", Validators.required],
      dueDate: ["", Validators.required],
      supplierId: this.supplierControl,
      installments: [""],
      status: this.statusControl,
      notes: [""],
    });
  }

  onSubmit() {
    if (this.invoiceForm.valid) {
      const invoice: Invoice = this.invoiceForm.value;
      console.log("invoiceForm: ", invoice);
      this.invoiceService.saveInvoice(this.invoiceForm.value).subscribe({
        next: () => {
          alert("Invoice saved successfully");
          this.router.navigate(["dashboard"]);
        },
        error: () => {
          alert("An error occurred while saving the invoice");
        },
      });
    } else {
      alert("Please fill in all fields");
    }
  }

  getSuppliers() {
    return this.supplierService.getSuppliers().subscribe({
      next: (data) => {
        this.supplierList = data;
      },
      error: (err) => {
        console.log("Error response:", err.response);
        alert("Error loading suppliers. Please try again.");
      },
    });
  }

  // onChangeSupplierControl(): void {
  //   this.supplierControl.valueChanges.subscribe((selectedSupplier) => {
  //     console.log("selectedSupplier: ", selectedSupplier);
  //     this.invoiceForm.get("supplierId")?.setValue(selectedSupplier);
  //   });
  // }

  // onChangeStatusControl(): void {
  //   this.statusControl.valueChanges.subscribe((selectedSupplier) => {
  //     console.log("selectedStatus: ", selectedSupplier);
  //     this.invoiceForm.get("status")?.setValue(selectedSupplier);
  //   });
  // }
}
