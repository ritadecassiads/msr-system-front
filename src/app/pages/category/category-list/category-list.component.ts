import { Component, inject } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Category } from '../../../models/category';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ModalMessageService } from '../../../services/modal-message.service';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DeleteDialogComponent } from '../../../components/dialog/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: "app-category-list",
  imports: [MatTableModule, MatPaginatorModule, MatTableModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatFormFieldModule,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIcon,
    MatButtonModule],
  providers: [MatTableDataSource],
  templateUrl: "./category-list.component.html",
  styleUrl: "./category-list.component.css"
})
export class CategoryListComponent {
  readonly dialog = inject(MatDialog);

  constructor(private categoryService: CategoryService, private readonly modalService: ModalMessageService, private router: Router) { }

  displayedColumns: string[] = ["code", "name", "description", "actions"];
  categoryList: Category[] = [];

  dataSource = new MatTableDataSource<Category>();

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.dataSource.data = categories;
        this.categoryList = categories;
      },
      error: (err) => {
        console.log(err);
        this.modalService.showMessage('Algo deu errado ao carregar dados. Tente novamente.', 'error');
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (filterValue === "") {
      this.dataSource.data = this.categoryList;
    } else {
      const filterValueNumber = Number(filterValue);
      this.dataSource.data = this.categoryList.filter((category) => {
        const matchesName = category.name.toLowerCase().includes(filterValue);
        const matchesCode =
          !isNaN(filterValueNumber) &&
          category.code?.toString().includes(filterValue);
        return matchesName || matchesCode;
      });
    }
  }

  navigateToEditCategory(category: Category): void {
    this.router.navigate([`/category/edit/${category._id}`]);
  }

  openModalToConfirmDelete(category: Category): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { category },
      restoreFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteCategory(category);
      }
    });
  }

  deleteCategory(category: Category) {
    if (category._id) {
      this.categoryService.deleteCategory(category._id).subscribe(() => {
        this.loadCategories();
        this.modalService.showMessage("Categoria deletada.", "success");
      });
    }
  }
}
