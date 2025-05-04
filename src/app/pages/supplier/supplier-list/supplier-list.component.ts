import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Supplier } from '../../../models/supplier';
import { SupplierService } from '../../../services/supplier.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { DeleteDialogComponent } from '../../../components/dialog/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalMessageService } from '../../../services/modal-message.service';

@Component({
  selector: "app-supplier-list",
  imports: [MatTableModule, MatPaginatorModule,
    MatPaginator,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatFormFieldModule,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIcon,
    MatButtonModule,],
  providers: [MatTableDataSource],
  templateUrl: "./supplier-list.component.html",
  styleUrl: "./supplier-list.component.css"
})
export class SupplierListComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  constructor(private supplierService: SupplierService, private router: Router, private readonly modalService: ModalMessageService) { }

  supplierList: Supplier[] = [];
  displayedColumns: string[] = [
    "code",
    "name",
    "cnpj",
    "phone",
    "email",
    "address",
    "actions"
  ];

  dataSource = new MatTableDataSource<Supplier>();


  ngOnInit() {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.supplierService.getSuppliers().subscribe((data: Supplier[]) => {
      this.dataSource.data = data;
      this.supplierList = data;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (filterValue === "") {
      this.dataSource.data = this.supplierList;
    } else {
      const filterValueNumber = Number(filterValue);
      this.dataSource.data = this.supplierList.filter((supplier) => {
        const matchesName = supplier.name.toLowerCase().includes(filterValue);
        const matchesCode =
          !isNaN(filterValueNumber) &&
          supplier.code?.toString().includes(filterValue);
        return matchesName || matchesCode;
      });
    }
  }

  openModalToConfirmDelete(supplier: Supplier): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { supplier },
      restoreFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        this.deleteSupplier(supplier);
      }
    });
  }

  nivagateToEditSupplier(supplier: Supplier) {
    this.router.navigate([`/supplier/edit/${supplier._id}`]);
  }

  deleteSupplier(supplier: Supplier) {
    if (supplier._id) {
      this.supplierService.deleteSupplier(supplier._id).subscribe(() => {
        this.loadSuppliers();
        this.modalService.showMessage("Produto deletado.", "success");
      });
    }
  }
}
