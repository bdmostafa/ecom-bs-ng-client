import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css']
})
export class HomeLayoutComponent implements OnInit {
  authStatus: boolean;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.authState$.subscribe((auth) => (this.authStatus = auth));
    console.log("auth state", this.authStatus)
  }

}
