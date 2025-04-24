import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { Router, RouterModule } from '@angular/router';
import { Form, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ModalMessageService } from '../../../services/modal-message.service';

@Component({
  selector: "app-category-register",
  standalone: true,
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
  styleUrl: "./category-register.component.css",
})
export class CategoryRegisterComponent {
  categoryForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private categoryService: CategoryService,
    private modalService: ModalMessageService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      this.categoryService.saveCategory(this.categoryForm.value).subscribe({
        next: () => {
          this.modalService.showMessage('As informações foram salvas.', 'success');
          this.router.navigate(["/dashboard"]);
        },
        error: (err) => {
          console.log(err);
          this.modalService.showMessage('Algo deu errado. Tente novamente.', 'error');
        },
      });
    } else {
      this.modalService.showMessage('Preencha os campos obrigatórios antes de continuar.', 'alert');
    }
  }

  initForm() {
    this.categoryForm = this.fb.group({
      name: ["", Validators.required],
      description: [""],
    });
  }
}
