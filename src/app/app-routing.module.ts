import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PricipalComponent } from './pricipal/pricipal.component';
import { ListComponent } from './list/list.component';

/** 
 * Al ser unicamente una aplicacion de pocas pantallas con una funcionalidad pequeña
 * no se utilizaran tenicas de mejora de rendimiento como lo puede ser lazy loading o quicklinkstrategy
 * pero si se planeara hacer crecer esta aplicacion se recomendaria aplicar dichas tenicas para la optimizacion
 * del codigo para el usuario final
*/

const routes: Routes = [
    {
        path: 'inicio', component: PricipalComponent,
    },
    {
        path: 'list', component: ListComponent,
    },
    { path: '', redirectTo: '/inicio', pathMatch: 'full' },
    { path: '**', redirectTo: '/inicio', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
