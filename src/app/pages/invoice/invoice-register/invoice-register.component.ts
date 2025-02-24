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
import { debounceTime } from "rxjs";
import { ModalMessageService } from "../../../services/modal-message.service";

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
  installmentValue: number = 0;

  installmentControl = new FormControl("");
  installmentList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  statusControl = new FormControl("");
  statusList = ["Aberta", "Paga", "Atrasada"];

  constructor(
    private invoiceService: InvoiceService,
    private supplierService: SupplierService,
    private fb: FormBuilder,
    private router: Router,
    private modalService: ModalMessageService
  ) {}

  ngOnInit() {
    this.initForm();
    //this.onChangeSupplierControl();
    //this.onChangeStatusControl();
    this.getSuppliers();
  }

  get installments() {
    return this.invoiceForm.get("installments");
  }

  initForm() {
    this.invoiceForm = this.fb.group({
      totalAmount: [
        0,
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      ],
      issueDate: ["", Validators.required],
      dueDate: ["", Validators.required],
      supplierId: this.supplierControl,
      installments: [0, Validators.pattern(/^\d+$/)],
      installmentValue: [0],
      notes: [""],
    });
  }

  onChangeInstallmentControl(): void {
    this.installmentControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((selectedInstallment) => {
        this.installments?.setValue(selectedInstallment, { emitEvent: false });
        this.updateInstallmentValue();
      });
  }

  updateInstallmentValue(): void {
    const amount = parseFloat(this.invoiceForm.get("amount")?.value);
    const installments = parseInt(
      this.invoiceForm.get("installments")?.value,
      10
    );

    if (!isNaN(amount) && !isNaN(installments) && installments > 0) {
      this.installmentValue = amount / installments;
    } else {
      this.installmentValue = 0;
    }
  }

  onSubmit() {
    const invoice: Invoice = this.invoiceForm.value;

    // this.convertStringToNumber(invoice);

    if (this.invoiceForm.valid) {
      this.invoiceService.saveInvoice(this.invoiceForm.value).subscribe({
        next: () => {
          this.modalService.showMessage('As informações foram registradas.', 'success');
          //this.router.navigate(["dashboard"]);
        },
        error: (err) => {
          console.error(err);
          this.modalService.showMessage('Algo deu errado. Tente novamente.', 'error');
        },
      });
    } else {
      this.modalService.showMessage('Preencha os campos obrigatórios antes de continuar.', 'alert');
    }
  }

  getSuppliers() {
    return this.supplierService.getSuppliers().subscribe({
      next: (data) => {
        this.supplierList = data;
      },
      error: (err) => {
        console.log("Error response:", err.response);
        this.modalService.showMessage('Algo deu errado ao carregar dados. Tente novamente.', 'error');
      },
    });
  }

  // convertStringToNumber(invoice: Invoice) {
  //   invoice.amount = parseFloat(invoice.amount.toString());
  //   invoice.installments = parseInt(invoice.installments.toString());
  // }

  // calculateInstallmentValue() {
  //   const amount = parseFloat(this.invoiceForm.get("amount")?.value);
  //   const installments = parseInt(this.invoiceForm.get("installments")?.value);
  //   console.log("amount + installments", amount, installments);

  //   if (!isNaN(amount) && !isNaN(installments) && installments > 0) {
  //     this.installmentValue = amount / installments;
  //   } else {
  //     this.installmentValue = 0;
  //   }
  //   console.log("calculateInstallmentValue", this.installmentValue);
  // }
}
