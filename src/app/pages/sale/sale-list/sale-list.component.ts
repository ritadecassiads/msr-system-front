import { Component, OnInit } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule, MatGridTile } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { SaleService } from "../../../services/sale.service";
import { Sale } from "../../../models/sale";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: "app-sale-list",
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatIcon],
  templateUrl: "./sale-list.component.html",
  styleUrl: "./sale-list.component.css",
})
export class SaleListComponent implements OnInit {
  displayedColumns: string[] = [
    "code",
    "total",
    "quantity",
    "openedByEmployee",
    "navigate"
  ];
  dataSource = new MatTableDataSource<Sale>();
  // salesList: Sale[] = [];

  constructor(private saleService: SaleService) {
    // Defina a função de filtro personalizada
    // this.dataSource.filterPredicate = (data: Sale, filter: string) => {
    //   return data.code.toLowerCase().includes(filter);
    // };
  }

  ngOnInit() {
    this.getSales();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log("filtro: ", filterValue);
  }

  getSales() {
    this.saleService.getSales().subscribe({
      next: (sales) => {
        this.dataSource.data = sales;
        console.log("vendas: ", sales);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
