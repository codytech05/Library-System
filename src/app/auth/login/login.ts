import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      const payload = {
        USERNAME: username,
        PASSWORD: password,
      };

      console.log('Sending Data to Backend:', payload);

      this.authService.login(payload).subscribe({
        next: (res: any) => {
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
          console.error('API Response Error:', err);
          alert('Login Failed! Please check credentials.');
        },
      });
    } else {
      alert('Please fill the form correctly.');
    }
  }
}
