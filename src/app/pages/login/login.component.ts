import { Component, inject } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule, MatCardSubtitle } from "@angular/material/card";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { MatToolbarModule } from "@angular/material/toolbar";
import { ModalMessageService } from "../../services/modal-message.service";
import { LoaderComponent } from "../../components/loader/loader.component";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterModule,
    MatToolbarModule,
    MatCardSubtitle,
    LoaderComponent
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  loginForm = new FormGroup({
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
  });

  hidePassword = true;

  constructor(private modalService: ModalMessageService) {}

  togglePasswordVisibility(event: MouseEvent) {
    this.hidePassword = !this.hidePassword;
    event.stopPropagation();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      if (username && password) {
        this.authService.login(username, password).subscribe({
          next: (response) => {
            console.log("Login successful!", response);
            sessionStorage.setItem("access_token", response.access_token);
            this.router.navigate(["/dashboard"]);
          },
          error: (error) => {
            console.error("Login failed", error);
            this.modalService.showMessage('Algo deu errado. Por favor, verifique suas credenciais.', 'error');
          },
        });
      }
    }
  }
}
