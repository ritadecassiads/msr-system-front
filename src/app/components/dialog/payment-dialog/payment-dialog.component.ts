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
    @Inject(MAT_DIALOG_DATA) public data: { installment: Installment }, // Dados passados para o modal
    private fb: FormBuilder,
    // private installmentService: InstallmentService 
  ) {
    this.paymentForm = this.fb.group({
      paymentMethod: ['', Validators.required], // Forma de pagamento
      amountPaid: [this.data.installment.amount, [Validators.required, Validators.min(0.1)]], // Valor pago
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirmPayment(): void {
    if (this.paymentForm.valid) {
      const paymentData = {
        amountPaid: this.paymentForm.value.amountPaid,
        paymentMethod: this.paymentForm.value.paymentMethod
      };

      console.log('Dados do pagamento:', paymentData);

      // this.installmentService.payInstallment(this.data.installment._id, paymentData).subscribe(
      //   response => {
      //     // Lógica após pagamento confirmado
      //     this.dialogRef.close(true); // Fechar o modal e retornar sucesso
      //   },
      //   error => {
      //     console.error(error);
      //     alert('Erro ao registrar o pagamento.');
      //   }
      // );
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  }
}
