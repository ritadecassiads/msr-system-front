import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormControl,
  AbstractControl,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from "@angular/material/card";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ProductService } from "../../../services/product.service";
import { Product } from "../../../models/products";
import { MatOption, MatSelectModule } from "@angular/material/select";
import { CategoryService } from "../../../services/category.service";
import { Category } from "../../../models/category";
import { SupplierService } from "../../../services/supplier.service";
import { Supplier } from "../../../models/supplier";
import { ModalMessageService } from "../../../services/modal-message.service";

@Component({
  selector: "app-product-register",
  standalone: true,
  templateUrl: "./product-register.component.html",
  styleUrl: "./product-register.component.css",
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOption,
    CommonModule,
  ],
})
export class ProductRegisterComponent implements OnInit {
  productForm: FormGroup = new FormGroup({});
  productId!: string;
  productToEdit!: Product;
  isEditing: boolean = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly supplierService: SupplierService,
    private readonly route: ActivatedRoute,
    private readonly modalService: ModalMessageService
  ) {}

  supplierList: Supplier[] = [];
  supplierControl = new FormControl("");
  categoryList: Category[] = [];
  categoriesControl = new FormControl<string[]>([]);

  ngOnInit() {
    this.getCategories();
    this.getSuppliers();
    this.initializeForm();
    this.initializeCategoryControl();
    this.onChangeSupplierControl();
    this.recoverIdToEdit();
  }

  get categories(): FormArray {
    return this.productForm.get("categories") as FormArray;
  }

  get supplier(): AbstractControl<any, any> | null {
    return this.productForm.get("supplier");
  }

  onChangeSupplierControl(): void {
    this.supplierControl.valueChanges.subscribe((selectedSupplier) => {
      this.productForm.get("supplierId")?.setValue(selectedSupplier);
    });
  }

  initializeCategoryControl(): void {
    this.categoriesControl.valueChanges.subscribe((selectedCategories) => {
      return this.setCategories(selectedCategories || []);
    });
  }

  setCategories(selectedCategories: string[]): void {
    this.categories.clear();
    selectedCategories.forEach((category) => {
      this.categories.push(new FormControl(category, Validators.required));
    });
  }

  getCategories() {
    return this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categoryList = data;
      },
      error: (err) => {
        console.log("Error response:", err.response);
        this.modalService.showMessage('Algo deu errado ao carregar dados. Tente novamente.', 'error');
      },
    });
  }

  getSuppliers() {
    return this.supplierService.getSuppliers().subscribe({
      next: (data) => {
        this.supplierList = data;
      },
      error: (err) => {
        console.log("Error response:", err.response);
        this.modalService.showMessage('Algo deu errado ao carregar dados. Tente novamente.', 'error');
      },
    });
  }

  initializeForm(product?: Product) {
    this.productForm = this.fb.group({
      name: [product?.name || "", Validators.required],
      description: product?.description || "",
      price: [product?.price || "", Validators.required],
      stock: [product?.stock || "", Validators.required],
      supplierId: [product?.supplierId || ""],
      categories: this.fb.array(
        product?.categories?.map((cat) => this.fb.control(cat)) || []
      ),
    });

    if (product?.supplierId) {
      this.supplierControl.setValue(product.supplierId._id || null);
    }

    product?.categories.forEach((categoryId: Category) => {
      this.categories.push(new FormControl(categoryId)); // Adicione os IDs das categorias
    });

    if (product?.categories) {
      this.categoriesControl.setValue(product.categories.map(category => category._id).filter((id): id is string => !!id)); // Preenche o controle de seleção
    }
    console.log("categorias: ", product?.categories);
  }

  onSubmit() {
    if (this.productForm.valid) {
      const product: Product = this.productForm.value;
      product.price = Number(product.price.toString().replace(",", "."));
      product.stock = Number(product.stock);

      if (this.isEditing) {
        const updatedProduct = {
          ...this.productToEdit,
          ...this.productForm.value,
        };

        this.updateProduct(updatedProduct);
      } else {
        this.createProduct(product);
      }
    } else {
      this.modalService.showMessage('Preencha os campos obrigatórios antes de continuar.', 'alert');
    }
  }

  createProduct(product: Product): void {
    this.productService.saveProduct(product).subscribe({
      next: () => {
        this.modalService.showMessage('As informações foram salvas.', 'success');
        this.router.navigate(["/product/list"]);
      },
      error: (err) => {
        console.error(err);
        this.modalService.showMessage('Algo deu errado. Tente novamente.', 'error');
      },
    });
  }

  updateProduct(product: Product): void {
    console.log("Product to update: ", product);

    this.productService.updateProduct(product).subscribe({
      next: () => {
        this.modalService.showMessage('As informações foram salvas.', 'success');
        this.router.navigate(["/product/list"]);
      },
      error: (err) => {
        console.error(err);
        this.modalService.showMessage('Algo deu errado. Tente novamente.', 'error');
      },
    });
  }

  recoverIdToEdit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");
      if (id) {
        this.isEditing = true;
        this.productId = id;
        this.loadProduct();
      } else {
        this.isEditing = false;
      }
    });
  }

  loadProduct(): void {
    this.productService.getProduct(this.productId).subscribe({
      next: (product) => {
        this.productToEdit = product;
        this.initializeForm(product);

        console.log("carregou o produto: ", product);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
