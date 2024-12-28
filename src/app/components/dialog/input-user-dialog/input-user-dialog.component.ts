import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  signal,
  viewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule, MatMenuTrigger } from "@angular/material/menu";

@Component({
  selector: "app-dialog",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatMenuModule,
  ],
  templateUrl: "./input-user-dialog.component.html",
  styleUrl: "./input-user-dialog.component.css",
})
export class InputUserDialogComponent {
  readonly dialogRef = inject(MatDialogRef<InputUserDialogComponent>);
  username: string = "";

  cancel(): void {
    this.dialogRef.close();
  }

  confirm(): void {
    this.dialogRef.close(this.username);
  }
}
