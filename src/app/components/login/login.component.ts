import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  titulo = 'Please Sign In!';
  user: User;
  constructor(private authService: AuthService, private router: Router) {
    this.user = new User();
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      swal.fire('Login', `Hello ${this.authService.user.username},  You are already authenticated!`, 'info');
      this.router.navigate(['/tasks']);
    }
  }

  login(): void {
    if (this.user.username === '' || this.user.password === '') {
      swal.fire('Error Login', 'Username o password is incorrect!', 'error');
      return;
    }

    this.authService.login(this.user).subscribe(response => {
      this.authService.saveUser(response.access_token);
      this.authService.saveToken(response.access_token);
      const user = this.authService.user;
      this.router.navigate(['/tasks']);
      swal.fire('Login', `Hola ${user.username}, has iniciado sesión con éxito!`, 'success');
    }, err => {
      if (err.status === 400) {
        swal.fire('Error Login', 'Username o password is incorrect!', 'error');
      }

    }
    );

  }

}
