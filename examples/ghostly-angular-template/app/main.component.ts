import { Component, Input } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';

@Component({
    selector: 'main',
    template: `
        <h1>My First Angular 2 App</h1>
        <p>With an embedded <a [routerLink]="['GhostlyTemplate']">Ghostly template</a>!</p>
    `,
    directives: [ROUTER_DIRECTIVES],
})
export class MainComponent { }
