import { Component, OnInit } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule, MatGridTile } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { SaleService } from "../../../services/sale.service";
import { Sale } from "../../../models/sale";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from "@angular/material/card";
import { CommonModule } from "@angular/common";
import { SaleProduct } from "../../../models/sale-product";
import { MatList, MatListItem } from "@angular/material/list";
import { MatSelectModule } from "@angular/material/select";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-sale-list",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIcon,
    MatExpansionModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardSubtitle,
    CommonModule,
    MatListItem,
    MatList,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./sale-list.component.html",
  styleUrl: "./sale-list.component.css",
})
export class SaleListComponent implements OnInit {
  displayedColumns: string[] = [
    "code",
    "name",
    "unitPrice",
    // "quantity",
    "totalPrice",
  ];

  salesList: Sale[] = [];
  saleProductsList: SaleProduct[] = [];
  filteredSales = this.salesList;
  statusFilter = new FormControl();
  statusList: string[] = ["open", "closed"];
  statusMap: { [key: string]: string } = {
    open: "Abertas",
    closed: "Fechadas",
  };

  constructor(private saleService: SaleService, private router: Router) {}

  ngOnInit() {
    this.getSales();

    this.statusFilter.valueChanges.subscribe((selectedStatus) => {
      this.applyStatusFilter(selectedStatus);
    });
  }

  applyStatusFilter(selectedStatus: string[]): void {
    if (selectedStatus.length === 0) {
      this.filteredSales = this.salesList;
    } else {
      this.filteredSales = this.salesList.filter(
        (sale) => sale.status && selectedStatus.includes(sale.status)
      );
    }
  }

  getStatusFilterText() {
    return (
      this.statusFilter.value
        ?.map((status: string) => this.statusMap[status])
        .join(", ") || ""
    );
  }

  getSales() {
    this.saleService.getSales().subscribe({
      next: (sales) => {
        this.salesList = sales;
        this.filteredSales = sales;
        this.saleProductsList = sales.flatMap((sale) => sale.products);
        console.log("vendas: ", sales);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  navigateToCloseSale(saleId: string): void {
    this.router.navigate(["/sale/close", saleId]);
  }
}
