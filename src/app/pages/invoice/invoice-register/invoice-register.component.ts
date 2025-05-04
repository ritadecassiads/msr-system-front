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
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { InvoiceService } from "../../../services/invoice.service";
import { SupplierService } from "../../../services/supplier.service";
import { Supplier } from "../../../models/supplier";
import { MatOption } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { Invoice } from "../../../models/invoice";
import { debounceTime } from "rxjs";
import { ModalMessageService } from "../../../services/modal-message.service";
import { Installment } from "../../../models/installment";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { SharedService } from "../../../shared/services/shared.service";

@Component({
  selector: "app-invoice-register",
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
    CommonModule,
    MatTableModule
  ],
  providers: [MatTableDataSource],
  templateUrl: "./invoice-register.component.html",
  styleUrl: "./invoice-register.component.css"
})
export class InvoiceRegisterComponent implements OnInit {
  invoiceForm: FormGroup = new FormGroup({});
  supplierControl = new FormControl("");
  supplierList: Supplier[] = [];

  installmentControl = new FormControl(1);
  installmentList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  statusControl = new FormControl("pending", Validators.required);
  statusList = [
    { label: "Aberta", value: "pending" },
    { label: "Paga", value: "paid" },
    { label: "Atrasada", value: "overdue" },
  ];

  isEditing: boolean = false;
  invoiceToEdit!: Invoice;
  dataSource = new MatTableDataSource<Installment>();

  constructor(
    private invoiceService: InvoiceService,
    private supplierService: SupplierService,
    private fb: FormBuilder,
    private router: Router,
    private modalService: ModalMessageService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
    this.initializeForm()
    this.onChangeSupplierControl();
    this.onChangeInstallmentControl();
    this.getSuppliers();
    this.recoverIdToEdit();
  }

  get installments() {
    return this.invoiceForm.get("installments");
  }

  get totalAmount() {
    return this.invoiceForm.get("totalAmount");
  }

  get issueDate() {
    return this.invoiceForm.get("issueDate");
  }

  get dueDate() {
    return this.invoiceForm.get("dueDate");
  }


  initializeForm(invoice?: Invoice) {
    this.invoiceForm = this.fb.group({
      totalAmount: [
        invoice?.totalAmount || 0,
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
      ],
      issueDate: [
        invoice?.issueDate ? new Date(invoice.issueDate).toISOString().substring(0, 10) : "",
      ],
      dueDate: [
        invoice?.dueDate ? new Date(invoice.dueDate).toISOString().substring(0, 10) : "",
      ],
      supplierId: [invoice?.supplierId || null],
      installments: [invoice?.installments || []],
      status: [invoice?.status || "pending", Validators.required],
      notes: [invoice?.notes || ""],
      description: [invoice?.description || ""],
    });

    this.statusControl.setValue(invoice?.status || "pending");

    const installmentCount = invoice?.installments?.length || 1;
    this.installmentControl.setValue(installmentCount);

    if (invoice?.supplierId) {
      this.supplierControl.setValue(invoice.supplierId?._id || "");
    }
  }

  onChangeInstallmentControl(): void {
    this.installmentControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((selectedInstallment) => {
        this.installments?.setValue(selectedInstallment, { emitEvent: false });
        console.log("Parcelas selecionadas:", selectedInstallment);

        this.updateInstallmentValue();

      });
  }

  onChangeSupplierControl(): void {
    this.supplierControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((selectedSupplierId) => {
        this.invoiceForm.get("supplierId")?.setValue(selectedSupplierId, { emitEvent: false });
      });
  }

  updateInstallmentValue(): void {
    const totalAmount = parseFloat(this.invoiceForm.get("totalAmount")?.value || "0");
    const installmentsCount = this.installments?.value || 0;
  
    if (installmentsCount <= 1 || totalAmount <= 0) {
      this.clearInstallments();
      return;
    }
  
    if (isNaN(totalAmount) || isNaN(installmentsCount)) {
      this.clearInstallments();
      return;
    }
  
    const installmentValue = parseFloat((totalAmount / installmentsCount).toFixed(2));
    const installments = this.generateInstallments(installmentsCount, installmentValue);
  
    this.installments?.setValue(installments, { emitEvent: false });
    console.log("installments no form", this.installments?.value);
  }
  
  private clearInstallments(): void {
    this.installments?.setValue([], { emitEvent: false });
  }
  
  private generateInstallments(count: number, value: number): Installment[] {
    const today = new Date();
    const installments: Installment[] = [];
  
    for (let i = 0; i < count; i++) {
      const dueDate = new Date(today);
      dueDate.setMonth(today.getMonth() + i + 1);
  
      installments.push({
        dueDate: new Date(dueDate.toISOString().substring(0, 10)),
        amount: value,
        status: "pending",
      });
    }
  
    return installments;
  }

  onSubmit() {
    const invoice: Invoice = this.validateFields();

    console.log("invoice", invoice);

    if (this.invoiceForm.valid) {
      if (this.isEditing) {
        const updatedInvoice = {
          ...this.invoiceToEdit,
          ...this.invoiceForm.value,
        };

        this.updateInvoice(updatedInvoice);
      } else {
        this.createInvoice(invoice);
      }
    } else {
      this.modalService.showMessage('Preencha os campos obrigatórios antes de continuar.', 'alert');
    }

  }

  validateFields() {
    const invoice: Invoice = this.invoiceForm.value;

    invoice.totalAmount = parseFloat(this.totalAmount?.value);

    if (invoice.issueDate) {
      invoice.issueDate = this.sharedService.convertToDate(this.issueDate?.value);
    } else {
      delete invoice.issueDate;
    }

    if (invoice.dueDate) {
      invoice.dueDate = this.sharedService.convertToDate(this.dueDate?.value);
    } else {
      delete invoice.dueDate;
    }

    return invoice;
  }

  updateInvoice(invoice: Invoice) {
    this.invoiceService.updateInvoice(invoice).subscribe({
      next: () => {
        this.modalService.showMessage('As informações foram salvas.', 'success');
        this.router.navigate(["invoice/list"]);
      },
      error: (err) => {
        console.error(err);
        this.modalService.showMessage('Algo deu errado. Tente novamente.', 'error');
      },
    });
  }

  createInvoice(invoice: Invoice) {
    this.invoiceService.saveInvoice(invoice).subscribe({
      next: () => {
        this.modalService.showMessage('As informações foram salvas.', 'success');
        this.router.navigate(["invoice/list"]);
      },
      error: (err) => {
        console.error(err);
        this.modalService.showMessage('Algo deu errado. Tente novamente.', 'error');
      },
    });
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

  recoverIdToEdit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");
      console.log("id", id);
      if (id) {
        this.isEditing = true;
        this.loadInvoice(id);
      } else {
        this.isEditing = false;
      }
    });
  }

  loadInvoice(invoiceId: string) {
    this.invoiceService.getInvoice(invoiceId).subscribe({
      next: (invoice) => {
        this.invoiceToEdit = invoice;
        this.initializeForm(invoice);
        console.log("invoiceToEdit", this.invoiceToEdit);
      },
      error: (err) => {
        console.log(err);
        this.modalService.showMessage('Algo deu errado ao carregar dados. Tente novamente.', 'error');
      },
    });
  }
}
