import { ChangeDetectorRef, Component, OnDestroy, OnInit, Testability } from '@angular/core';
import { ghostly, Model, View } from '@divine/ghostly-runtime';

interface GhostlyModel {
    name: string;
    username: string;
    email: string;
}

@Component({
    selector: 'app-ghostly-template',
    template: `
        <div [class.pdf]="view?.contentType === 'application/pdf'">
        <h1>{{model.name}}, welcome to My Service!</h1>
        <p>We hope you will enjoy this service as much as we do.</p>
        <p>For your reference, your login name is <b>{{model.username}}</b>
        and your registered email address is <b>{{model.email}}</b>.
        Should you ever need to reset your password, that is the information
        you will need to provide.</p>
        <p>Again, welcome and please enjoy My Service!</p>
        <address>The My Service team</address>
        </div>
    `,
    styles: [
    ]
})
export class GhostlyTemplateComponent implements OnInit, OnDestroy {
    model: GhostlyModel = {
        name: 'Demo User',
        username: 'demo',
        email: 'demo@example.com',
    };

    view!: View;

    constructor(private changeDetector: ChangeDetectorRef, private testability: Testability) {
    }

    ngOnInit(): void {
        ghostly.init(this);
    }

    ngOnDestroy(): void {
        ghostly.destroy(this);
    }

    ghostlyInit(source: Model): void {
        this.model = ghostly.parse(source);
    }

    ghostlyRender(view: View): Promise<void> {
        return new Promise((resolve) => {
            this.view = view;
            this.changeDetector.detectChanges();
            this.testability.whenStable(resolve);
        });
    }
}
