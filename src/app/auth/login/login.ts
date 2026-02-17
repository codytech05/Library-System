import { Component ,ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  showPassword = false;
  isLoading = false;
  
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { username, password } = this.loginForm.value;

      const payload = {
        USERNAME: username,
        PASSWORD: password,
      };

      console.log('Sending Data to Backend:', payload);

      this.authService.login(payload).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          // --- AUTO-UPDATE: Token save karva mate niche ni lines ---
          if (res && res.token) {
            localStorage.setItem('token', res.token); // Aa line books access karva mate jaruri che
            console.log('Token received and saved successfully!');
          }
  
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });

          Toast.fire({
            icon: 'success',
            title: 'Signed in successfully',
          });
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('API Response Error:', err);
          alert('Login Failed! Please check credentials.');
        },
      });
    } else {
      alert('Please fill the form correctly.');
    }
  }
}
