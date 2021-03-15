import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GhostlyTemplateComponent } from './ghostly-template/ghostly-template.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
    },
    {
        path: 'ghostly-template',
        component: GhostlyTemplateComponent,
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
