import { Routes } from '@angular/router';
import { CadastroPessoasComponent } from './components/cadastro-pessoas/cadastro-pessoas.component';

export const routes: Routes = [
  { path: '', redirectTo: 'cadastro-pessoas', pathMatch: 'full' },
  { path: 'cadastro-pessoas', component: CadastroPessoasComponent },
  { path: '**', redirectTo: 'cadastro-pessoas' } // Rota coringa para redirecionar para o cadastro de pessoas
];