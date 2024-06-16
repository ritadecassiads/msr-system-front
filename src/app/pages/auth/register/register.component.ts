import { Component } from "@angular/core";
import { inject } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../../auth/auth.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.css",
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);

  public signupForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  public onSubmit() {
    if (this.signupForm.valid) {
      console.log(this.signupForm.value);

      // ver como mandar os campos validados e montados no user do tipo User
      this.authService.register(this.signupForm.value)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.router.navigate(['/login']);
          },
          error: (err) => console.log(err)
        });
    }
  }
}
