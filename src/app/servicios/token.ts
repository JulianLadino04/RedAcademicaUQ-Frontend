import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Buffer } from "buffer";

const TOKEN_KEY = "AuthToken";
@Injectable({
providedIn: 'root'
})
export class Token {
  constructor(private router: Router) { }

  public setToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public isLogged(): boolean {
    if (this.getToken()) {
      return true;
    }
      return false;
  }

  public login(token: string) {
    this.setToken(token);
    const rol = this.getRol();
    let destino = rol == "ADMINISTRADOR" ? "/panel-admin" : "/";
    this.router.navigate([destino]).then(() => {
    window.location.reload();
    });
  }

  public logout() {
    window.sessionStorage.clear();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  private decodePayload(token: string): any {
    if (!token || !token.includes('.')) {
      return {};
    }
    const payload = token.split(".")[1];
    if (!payload) {
      return {};
    }
    try {
      const payloadDecoded = Buffer.from(payload, 'base64').toString('ascii');
      const values = JSON.parse(payloadDecoded);
      return values;
    } catch (e) {
      return {};
    }
  }

  public getIDCuenta(): string {
    const token = this.getToken();
    if (token) {
      const values = this.decodePayload(token);
      return values.id;
    }
      return "";
    }
    public getRol(): string {
    const token = this.getToken();
    if (token) {
      const values = this.decodePayload(token);
      return values.rol;
    }
    return "";
  }
  public getEmail(): string {
    const token = this.getToken();
    if (token) {
      const values = this.decodePayload(token);
    return values.sub;
    }
    return "";
  }

  public verTokenDecodificado(): any {
    const token = this.getToken();

    if (!token) {
      console.log('❌ No hay token');
      return null;
    }

    const values = this.decodePayload(token);
    console.log('📦 Token decodificado:', values);

    return values;
  }

}
