import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Form, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ModalMessageService } from '../../../services/modal-message.service';
import { Category } from '../../../models/category';

@Component({
  selector: "app-category-register",
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
    CommonModule,
  ],
  templateUrl: "./category-register.component.html",
  styleUrl: "./category-register.component.css"
})
export class CategoryRegisterComponent {
  categoryForm: FormGroup = new FormGroup({});
  isEditing: boolean = false;
  categoryToEdit!: Category;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private categoryService: CategoryService,
    private modalService: ModalMessageService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.recoverIdToEdit();
  }

  onSubmit() {
    const category: Category = this.categoryForm.value;

    if (this.categoryForm.valid) {
      if (this.isEditing) {
        const updatedCategory = {
          ...this.categoryToEdit,
          ...category,
        }

        this.updateCategory(updatedCategory);
      } else {
        this.createCategory(category);
      }

    } else {
      this.modalService.showMessage('Preencha os campos obrigatórios antes de continuar.', 'alert');
    }
  }

  createCategory(category: Category) {
    this.categoryService.saveCategory(category).subscribe({
      next: () => {
        this.modalService.showMessage('As informações foram salvas.', 'success');
        this.router.navigate(["/category/list"]);
      },
      error: (err) => {
        console.log(err);
        this.modalService.showMessage('Algo deu errado. Tente novamente.', 'error');
      },
    });
  }

  updateCategory(category: Category) {
    this.categoryService.updateCategory(category).subscribe({
      next: () => {
        this.modalService.showMessage('As informações foram atualizadas.', 'success');
        this.router.navigate(["/category/list"]);
      },
      error: (err) => {
        console.log(err);
        this.modalService.showMessage('Algo deu errado. Tente novamente.', 'error');
      },
    });
  }


  initializeForm() {
    this.categoryForm = this.fb.group({
      name: ["", Validators.required],
      description: [""],
    });
  }

  recoverIdToEdit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");
      if (id) {
        this.isEditing = true;
        this.loadCategory(id);
      } else {
        this.isEditing = false;
      }
    });
  }

  loadCategory(id: string) {
    this.categoryService.getCategory(id).subscribe({
      next: (category) => {
        this.categoryForm.patchValue(category);
        this.categoryToEdit = category;
      },
      error: (err) => {
        console.log(err);
        this.modalService.showMessage('Algo deu errado ao carregar dados. Tente novamente.', 'error');
      },
    });
  }
}
