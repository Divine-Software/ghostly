import {Component} from '@angular/core';
import {MainComponent} from './main.component';
import {GhostlyTemplateComponent} from './ghostly-template.component';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';

import {LocationStrategy, Location, HashLocationStrategy} from '@angular/common';
import {provide, enableProdMode} from '@angular/core';

@RouteConfig([
    {
        path:         '/',
        name:         'Main',
        component:    MainComponent,
        useAsDefault: true
    },
    {
        path:      '/ghostly-template',
        name:      'GhostlyTemplate',
        component: GhostlyTemplateComponent
    },
])
@Component({
    selector:   'my-app',
    template:   '<router-outlet></router-outlet>',
    directives: [ROUTER_DIRECTIVES],
    providers:  [ROUTER_PROVIDERS, provide(LocationStrategy, {useClass: HashLocationStrategy})],
})
export class AppComponent { }
