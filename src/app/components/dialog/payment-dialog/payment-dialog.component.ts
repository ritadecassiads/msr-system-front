import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Installment } from '../../../models/installment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { SaleService } from '../../../services/sale.service';
import { ModalMessageService } from '../../../services/modal-message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    CommonModule
  ],
  templateUrl: './payment-dialog.component.html',
  styleUrl: './payment-dialog.component.css'
})
export class PaymentDialogComponent {
  paymentForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { installment: Installment, saleId: string },
    private fb: FormBuilder,
    private saleService: SaleService,
    private modalService: ModalMessageService,
    private router: Router
  ) {
    this.paymentForm = this.fb.group({
      amount: [this.data.installment.amount, [Validators.required, Validators.min(0.1)]],
      paymentMethod: ['', Validators.required],
      paymentDate: [new Date(), Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirmPayment(): void {
    if (this.paymentForm.valid) {
      const paymentData: Installment = {
        _id: this.data.installment._id,
        amount: this.paymentForm.value.amount,
        paymentMethod: this.paymentForm.value.paymentMethod,
        paymentDate: this.paymentForm.value.paymentDate,
        status: 'paid'
      };

      console.log('Dados do pagamento:', paymentData);
      this.updateInstallmentOnSale(paymentData);
    } else {
      this.modalService.showMessage(
        "Preencha os campos obrigatórios antes de continuar.",
        "alert"
      );
    }
  }

  updateInstallmentOnSale(paymentData: Installment): void {
    this.saleService.updateInstallment(this.data.saleId, paymentData).subscribe({
      next: (response) => {
        this.modalService.showMessage(
          "Pagamento registrado.",
          "success"
        );
        this.router.navigate(["/client/list"]);
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.modalService.showMessage(
          "Algo deu errado. Tente novamente.",
          "error"
        );
        console.error(error);
      }

    })
  }
}
