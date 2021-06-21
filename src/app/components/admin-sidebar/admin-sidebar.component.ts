import { UserService } from 'src/app/services/user.service';
import { Component, Input, OnInit } from '@angular/core';
import { SocialUser } from 'angularx-social-login';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent implements OnInit {
  @Input() user: any;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  logout() {
    this.userService.logout();
  }

}
