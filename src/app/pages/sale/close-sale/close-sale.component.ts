import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SaleService } from "../../../services/sale.service";
import { Sale } from "../../../models/sale";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIcon } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatRadioModule } from "@angular/material/radio";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ProductService } from "../../../services/product.service";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from "@angular/material/card";
import { Client } from "../../../models/client";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { ClientService } from "../../../services/client.service";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatOption } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { ModalMessageService } from "../../../services/modal-message.service";

@Component({
  selector: "app-close-sale",
  standalone: true,
  imports: [
    MatGridListModule,
    CommonModule,
    MatExpansionModule,
    MatRadioModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTableModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardSubtitle,
    MatPaginatorModule,
    MatIcon,
    MatSortModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOption,
  ],
  // providers: [MatTableDataSource],
  templateUrl: "./close-sale.component.html",
  styleUrls: ["./close-sale.component.css"],
})
export class CloseSaleComponent implements OnInit {
  saleId!: string;
  sale: Sale = {} as Sale;
  selectedPaymentMethod: string = "cash";
  amountReceived: number = 0;
  change: number = 0;
  displayedColumns2: string[] = ["subtotal", "discount", "total"];
  todayDate: string = this.getTodayDate();
  discount: number = 0;
  subtotal: number = 0;
  clientList: Client[] = [];
  filteredClients: Client[] = [];
  isClientTableVisible: boolean = false;
  selectedClient: Client = {} as Client;

  displayedProductColumns: string[] = [
    "code",
    "name",
    "quantity",
    "unitPrice",
    "totalPrice",
  ];
  displayedClientColumns: string[] = [
    "code",
    "name",
    "cpf",
    "peopleAuthorized",
    "add",
  ];

  dataSource = new MatTableDataSource<Client>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild("clientSort") clientSort!: MatSort;

  selectedInstallments = new FormControl("", Validators.required);
  installmentsOptions: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  installmentValue: number = 0;
  dueDates: Date[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private saleService: SaleService,
    private productService: ProductService,
    private clientService: ClientService,
    private readonly modalService: ModalMessageService,
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = "Itens por página";
    this.dataSource.sort = this.clientSort;
  }

  ngOnInit(): void {
    this.saleId = this.route.snapshot.paramMap.get("_id")!;
    this.loadSaleDetails();
    this.getClients();
  }

  loadSaleDetails(): void {
    this.saleService.getSale(this.saleId).subscribe((sale) => {
      if (sale.status === "closed") {
        this.router.navigate(["/dashboard"]);
        return;
      }
      this.sale = sale;
      this.subtotal = this.sale.total;
      // this.loadProducts(sale.products);
    });
  }

  calculateChange(): void {
    this.change = this.amountReceived - this.sale.total;
  }

  confirmSale(): void {
    this.sale.status = "closed";
    this.sale.paymentMethod = this.selectedPaymentMethod as any;

    console.log("sale -----> ", this.sale);

    this.saleService.updateSale({ ...this.sale }).subscribe(() => {
      this.modalService.showMessage('Venda finalizada.', 'success');
      this.router.navigate(["/dashboard"]);
    });
  }

  cancel(): void {
    this.router.navigate(["/dashboard"]);
  }

  getTodayDate(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Janeiro é 0!
    const year = today.getFullYear();

    return `${day}/${month}/${year}`;
  }

  calculateDiscount(): void {
    const discountValue = this.discount || 0;
    this.sale.total = this.subtotal - discountValue;
  }

  getClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clientList = clients;
        this.dataSource.data = this.clientList;
      },
      error: (error) => {
        console.error("Error loading clients: ", error);
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (filterValue === "") {
      this.dataSource.data = this.clientList;
    } else {
      const filterValueNumber = Number(filterValue);
      this.dataSource.data = this.clientList.filter((client) => {
        const matchesName = client.name.toLowerCase().includes(filterValue);
        const matchesCPF =
          !isNaN(filterValueNumber) &&
          client.cpf?.toString().includes(filterValue);
        return matchesName || matchesCPF;
      });
    }
  }

  selectClient(client: Client): void {
    this.selectedClient = client;
    this.sale.clientId = client;
    this.sale.installments = this.selectedInstallments
      .value as unknown as number;

    this.sale.installmentValue = this.installmentValue;
    this.sale.dueDates = this.dueDates;
    console.log("sale: ", this.sale);
  }

  calculateInstallmentValue(): void {
    const selectedInstallments = this.selectedInstallments.value || 1;
    this.installmentValue =
      Number(this.sale.total) / Number(selectedInstallments);

      this.calculateDueDates();
  }

  calculateDueDates(): void {
    const today = new Date();
    const selectedInstallments = this.selectedInstallments.value || 1;
    this.dueDates = [];

    for (let i = 0; i < Number(selectedInstallments); i++) {
      const dueDate = new Date(today);
      dueDate.setMonth(today.getMonth() + i);
      this.dueDates.push(dueDate);
    }

    console.log("dueDates: ", this.dueDates);
  }

  onPaymentMethodChange(event: any): void {
    this.selectedPaymentMethod = event.value;
    // const saleDetailsElement =      this.el.nativeElement.querySelector("#sale-details");
    if (this.selectedPaymentMethod === "client-account") {
      this.isClientTableVisible = true;
      // this.renderer.addClass(saleDetailsElement, "sale-installments-client");
    } else {
      this.isClientTableVisible = false;
      // this.renderer.removeClass(saleDetailsElement, "sale-installments-client");
    }
  }
}
