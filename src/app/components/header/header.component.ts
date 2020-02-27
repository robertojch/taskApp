import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  title = 'Task App Angular';
  constructor(private authService: AuthService, private router: Router) { }


  logout() {
    const userName = this.authService.user.username;
    this.authService.logout();
    swal.fire('Logout', `Hello ${userName}, You have successfully logged out!`, 'success');
    this.router.navigate(['/login']);
  }

}
