
import { Injectable } from '@angular/core';

@Injectable()
export class PreferencesService {

    public apiKey: string;
    public apiSecret: string;

    constructor() {
        this.load();
    }

    public load() {
        this.apiKey = window.localStorage.getItem('key') || '';
        this.apiSecret = window.localStorage.getItem('secret') || '';
    }

    public set(apiKey: string = '', apiSecret: string = '') {
        window.localStorage.setItem('apiKey', apiKey);
        window.localStorage.setItem('apiSecret', apiSecret);
        this.load();
    }
}
