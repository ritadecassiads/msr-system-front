import { Component } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Category } from '../../../models/category';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: "app-category-list",
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatPaginator],
  providers: [MatTableDataSource],
  templateUrl: "./category-list.component.html",
  styleUrl: "./category-list.component.css",
})
export class CategoryListComponent {
  constructor(private categoryService: CategoryService) {}

  displayedColumns: string[] = ["code", "name", "description"];

  dataSource = new MatTableDataSource<Category>();

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.dataSource.data = categories;
      },
      error: (err) => {
        console.log(err);
        alert("Erro ao carregar categorias");
      },
    });
  }
}