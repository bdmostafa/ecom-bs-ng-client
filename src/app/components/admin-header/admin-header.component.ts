import { Component, Input, OnInit } from '@angular/core';
import { SocialUser } from 'angularx-social-login';
import { map } from 'rxjs/operators';
import { IUser, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {
  @Input() user: IUser;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

}
