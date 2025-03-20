import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'cadastro-pessoas', pathMatch: 'full' },
  {
    path: 'cadastro-pessoas',
    loadComponent: () => import('./components/cadastro-pessoas/cadastro-pessoas.component')
      .then(c => c.CadastroPessoasComponent)
  },
  { path: '**', redirectTo: 'cadastro-pessoas' }
];