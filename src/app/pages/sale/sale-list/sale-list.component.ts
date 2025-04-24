import { Component, OnInit, ViewChild } from "@angular/core";
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
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";

@Component({
    selector: "app-sale-list",
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
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
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatPaginatorModule,
    ],
    templateUrl: "./sale-list.component.html",
    styleUrl: "./sale-list.component.css"
})
export class SaleListComponent implements OnInit {
  displayedColumns: string[] = [
    "code",
    "name",
    "unitPrice",
    "quantity",
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

  dataSource: MatTableDataSource<Sale> = new MatTableDataSource<Sale>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSize = 10;
  currentPage = 0;

  constructor(private saleService: SaleService, private router: Router) {}

  ngOnInit() {
    this.getSales();

    this.statusFilter.valueChanges.subscribe((selectedStatus) => {
      this.applyStatusFilter(selectedStatus);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = "Itens por página";
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
        this.salesList = this.sortSalesByStatus(sales);
        this.filteredSales = sales;
        this.saleProductsList = sales.flatMap((sale) => sale.products);
        this.dataSource.data = this.filteredSales;
        console.log("sales: ", this.salesList);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  navigateToCloseSale(saleId: string): void {
    this.router.navigate(["/sale/close", saleId]);
  }

  sortSalesByStatus(sales: Sale[]): Sale[] {
    return sales.sort((a, b) => {
      if (a.status === "open" && b.status === "closed") {
        return -1;
      } else if (a.status === "closed" && b.status === "open") {
        return 1;
      } else {
        return this.sortSaleByDate(a, b);
      }
    });
  }

  sortSaleByDate(a: Sale, b: Sale): number {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }

  // Função para pegar as vendas paginadas
  getPagedSales() {
    const start = this.currentPage * this.pageSize;
    return this.filteredSales.slice(start, start + this.pageSize);
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  getPaymentMethod(paymentMethod: string): string {
    switch (paymentMethod) {
      case "credit-card":
        return "Crédito";
      case "debit-card":
        return "Débito";
      case "cash":
        return "Dinheiro";
      case "pix":
        return "Pix";
      case "bank-transfer":
        return "Transferência";
      case "client-account":
        return "incluída na conta do cliente";
      default:
        return "";
    }
  }
}
