import { ChangeDetectorRef, Component, OnDestroy, OnInit, Testability } from '@angular/core';
import { ghostly, Model, View } from '@divine/ghostly-runtime';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    name    = 'Angular';
    title   = 'ghostly-angular-template';
    github = {
        org:  'angular',
        repo: 'angular',
    };
    web = {
        main: 'https://angular.io',
        blog: 'https://blog.angular.io',
        cli : 'https://cli.angular.io',
    }
    cli     = 'ng';
    npm     = 'angular'
    discord = 'angular';
    twitter = 'angular';
    youtube = 'angular';

    constructor(private changeDetector: ChangeDetectorRef, private testability: Testability) {
    }

    ngOnInit(): void {
        ghostly.init(this);
    }

    ngOnDestroy(): void {
        ghostly.destroy(this);
    }

    ghostlyInit(source: Model): void {
        Object.assign(this, ghostly.parse(source));
    }

    ghostlyRender(_view: View): Promise<void> {
        return new Promise((resolve) => {
            this.changeDetector.detectChanges();
            this.testability.whenStable(resolve);
        });
    }
}
