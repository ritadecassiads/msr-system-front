import { Component, OnInit } from "@angular/core";
import { ClientService } from "../../../services/client.service";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { Client } from "../../../models/client";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";

@Component({
  selector: "app-client-list",
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatPaginator],
  providers: [CurrencyPipe, DatePipe, MatTableDataSource],
  templateUrl: "./client-list.component.html",
  styleUrl: "./client-list.component.css",
})
export class ClientListComponent implements OnInit {
  displayedColumns: string[] = [
    "name",
    "birthDate",
    "cpf",
    "rg",
    "phone",
    "email",
    "purchaseLimit",
    "notes",
    "createdByEmployee",
    "fathersName",
    "mothersName",
    "peopleAuthorized",
    "address",
  ];
  dataSource = new MatTableDataSource<Client>();

  constructor(private clientService: ClientService) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getAllClients().subscribe((data: Client[]) => {
      this.dataSource.data = data;
    });
  }
}
