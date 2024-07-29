import { Component } from "@angular/core";
import { inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../../auth/auth.service";
import { MatToolbar } from "@angular/material/toolbar";
import { MatCard } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { ThemePalette } from "@angular/material/core";
import { User } from "../../../models/user";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatToolbar,
    MatCard,
    MatButtonModule,
    MatSlideToggleModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.css",
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);

  constructor(private fb: FormBuilder) {}
  userForm!: FormGroup;

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ["", Validators.required],
      username: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(6)]],
      cpf: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      address: ["", Validators.required],
      phone: ["", Validators.required],
      isAdmin: [false],
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      console.log("Form Data: ", this.userForm.value);
      // ver como mandar os campos validados e montados no user do tipo User
      this.authService.register(this.userForm.value).subscribe({
        next: (data: any) => {
          console.log(data);
          this.router.navigate(["/dashboard"]);
        },
        error: (err) => console.log(err),
      });
    } else {
      console.log("Form is invalid");
    }
  }

  // public isAdminF() {
  //   console.log(this.isAdmin);
  // }

  // public onSubmit() {
  //   if (this.signupForm.valid) {
  //     console.log(this.signupForm.value);
  //     // ver como mandar os campos validados e montados no user do tipo User
  //     this.authService.register(this.signupForm.value).subscribe({
  //       next: (data: any) => {
  //         console.log(data);
  //         this.router.navigate(["/dashboard"]);
  //       },
  //       error: (err) => console.log(err),
  //     });
  //   }
  // }
}
