import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { User } from "../../../models/user";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { AuthService } from "../../../auth/auth.service";
import { Router, RouterModule } from "@angular/router";
import { inject } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatToolbarModule } from "@angular/material/toolbar";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressBarModule,
    RouterModule,
    ReactiveFormsModule,
    MatToolbarModule
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  constructor() {}

  user: User = {
    username: "",
    password: "",
  };

  // entender funcionamento do olhinho
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide);
    event.stopPropagation();
  }

  // entender
  protected loginForm = new FormGroup({
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
  });

  // entender
  // onSubmit(){
  //   if(this.loginForm.valid){
  //     console.log(this.loginForm.value);

  //     this.authService.login(this.user.username, this.user.password)

  //     .subscribe((data: any) => {
  //       if(this.authService.isLoggedIn()){
  //         this.router.navigate(['/admin']);
  //       }
  //       console.log(data);
  //     });
  //   }
  // }

  onSubmit() {
    // procurar formas melhores de validar campos
    if (this.user.username != "" && this.user.password != "") {
      this.authService.login(this.user.username, this.user.password).subscribe({
        next: (response) => {
          console.log("Login successful!", response);

          if (this.authService.isLoggedIn()) {
            this.router.navigate(["/dashboard"]);
          }
        },
        error: (error) => {
          console.error("Login failed", error);
          // Exiba uma mensagem de erro apropriada para o usuário
          alert("Falha no login. Por favor, verifique suas credenciais.");
        },
      });
    }
  }
}
