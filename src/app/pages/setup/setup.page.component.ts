import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-setup',
    templateUrl: './setup.page.component.html',
    styleUrls: ['./setup.page.component.scss']
})

export class SetupPageComponent implements OnInit {

    public key: string;
    public secret: string;

    constructor() { }

    ngOnInit() {
        this.key = window.localStorage.getItem('key') || '';
        this.secret = window.localStorage.getItem('secret') || '';
    }

    saveHandler() {
        window.localStorage.setItem('key', this.key || '');
        window.localStorage.setItem('secret', this.secret || '');
    }
}
