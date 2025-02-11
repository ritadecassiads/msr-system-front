import { Component, OnInit } from "@angular/core";
import { ClientService } from "../../../services/client.service";
import { MatTableModule } from "@angular/material/table";
import { Client } from "../../../models/client";
import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDatepickerModule } from "@angular/material/datepicker";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from "@angular/material/card";
import { MatSelectModule } from "@angular/material/select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-client-list",
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatPaginator,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
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
  ],
  providers: [CurrencyPipe, DatePipe],
  templateUrl: "./client-list.component.html",
  styleUrl: "./client-list.component.css",
})
export class ClientListComponent implements OnInit {
  clientsList: Client[] = [];
  filteredClients: Client[] = [];
  pageSize = 20;
  currentPage = 0;

  constructor(private clientService: ClientService, private router: Router) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getAllClients().subscribe((data: Client[]) => {
      this.clientsList = data;
      this.filteredClients = data;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (filterValue === "") {
      this.filteredClients = this.clientsList;
    } else {
      const filterValueNumber = Number(filterValue);

      this.filteredClients = this.clientsList.filter((client) => {
        const matchesName = client.name.toLowerCase().includes(filterValue);
        const matchesCode =
          !isNaN(filterValueNumber) &&
          client.code?.toString().includes(filterValue);
        return matchesName || matchesCode;
      });
    }
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  getPagedClients() {
    const start = this.currentPage * this.pageSize;
    return this.filteredClients.slice(start, start + this.pageSize);
  }

  editClient(client: Client) {
    this.router.navigate([`/client/edit/${client._id}`]);
  }
}
