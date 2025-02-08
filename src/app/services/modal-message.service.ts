import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalMessageComponent, ModalMessageData } from '../components/dialog/modal-message/modal-message.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalMessageService {
  constructor(private dialog: MatDialog) {}

  showMessage(message: string, type: 'success' | 'error' | 'validation', buttonText?: string): Observable<void> {
    const dialogRef = this.dialog.open(ModalMessageComponent, {
      data: { message, type, buttonText },
      width: '450px',
      disableClose: true
    });
    return dialogRef.afterClosed();
  }
}
