import { Routes } from '@angular/router';
import { Login } from './componentes/login/login';
import { Registro } from './componentes/registro/registro';
import { Inicio } from './componentes/inicio/inicio';

export const routes: Routes = [

  { path: '', component: Inicio },

  { path: 'login', component: Login },

  { path: 'registro', component: Registro }

];