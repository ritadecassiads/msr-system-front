import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Supplier } from '../../../models/supplier';
import { SupplierService } from '../../../services/supplier.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
    selector: "app-supplier-list",
    imports: [MatTableModule, MatPaginatorModule],
    providers: [MatTableDataSource],
    templateUrl: "./supplier-list.component.html",
    styleUrl: "./supplier-list.component.css"
})
export class SupplierListComponent implements OnInit {
  constructor(private supplierService: SupplierService) {}

  displayedColumns: string[] = [
    "code",
    "name",
    "cnpj",
    "phone",
    "email",
    "address",
  ];

  dataSource = new MatTableDataSource<Supplier>();

  ngOnInit() {
   this.loadSuppliers();
  }

  loadSuppliers() {
     this.supplierService.getSuppliers().subscribe((data: Supplier[]) => {
       this.dataSource.data = data;
     });
  }
}
