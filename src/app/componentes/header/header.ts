import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Token } from '../../servicios/token';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  title: string = 'Red Academica UQ';
  isLogged: boolean = false;
  email: string = '';

  constructor(private tokenService: Token) {
    this.isLogged = this.tokenService.isLogged();
    if (this.isLogged) {
      this.email = this.tokenService.getEmail();
    }
  }

  public logout() {
    this.tokenService.logout();
  }

}