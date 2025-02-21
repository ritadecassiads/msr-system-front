import { Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";

export interface ModalMessageData {
  message: string;
  type: "success" | "error" | "alert";
  buttonText?: string;
}

@Component({
  selector: "app-modal-message",
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatButtonModule,
    MatIcon,
    CommonModule,
  ],
  templateUrl: "./modal-message.component.html",
  styleUrl: "./modal-message.component.css",
})
export class ModalMessageComponent {
  constructor(
    public dialogRef: MatDialogRef<ModalMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalMessageData
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  getIcon(): string {
    return (
      {
        success: "check_circle",
        error: "error",
        alert: "warning",
      }[this.data.type] || "info"
    );
  }

  getTitle(): string {
    return (
      {
        success: "Feito!",
        error: "Ops!",
        alert: "Importante!",
      }[this.data.type] || "Informação"
    );
  }
}
