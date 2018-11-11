import { Component, Input, ChangeDetectorRef, Testability, OnInit, OnDestroy } from '@angular/core';

declare var ghostly : any;

export class GhostlyModel {
    name: string;
    username: string;
    email: string;
};

export class GhostlyView {
    contentType: string;
    params: any;
};

@Component({
    selector: 'ghostly-template',
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
})
export class GhostlyTemplateComponent implements OnInit, OnDestroy {
    model: GhostlyModel = {
        name:     'Demo User',
        username: 'demo',
        email:    'demo@example.com',
    };

    view: GhostlyView;

    constructor(private changeDetector: ChangeDetectorRef, private testability: Testability) {
    }

    ngOnInit() {
        ghostly.init(this);
    }

    ngOnDestroy() {
        ghostly.destroy(this);
    }

    ghostlyInit(source: GhostlyModel) {
        this.model = ghostly.parse(source);
    }

    ghostlyRender(view : GhostlyView) {
        return new Promise((resolve, reject) => {
            this.view = view;
            this.changeDetector.detectChanges();
            this.testability.whenStable(resolve);
        });
    }
}
