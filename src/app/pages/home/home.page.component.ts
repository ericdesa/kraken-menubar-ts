import { PreferencesService } from './../../services/preferences/preferences.service';
import { Component, OnInit } from '@angular/core';
import { KrakenService } from '../../services/kraken/kraken.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.component.html',
    styleUrls: [
        './home.page.component.scss',
        './home.page.component-idle.scss',
        './home.page.component-setup.scss',
    ]
})

export class HomePageComponent implements OnInit {

    public shouldShowSetup = false;
    public setupApiKey: string = '';
    public setupApiSecret: string = '';

    constructor(
        protected notificationService: NotificationsService,
        protected krakenService: KrakenService,
        protected preferencesService: PreferencesService) {
    }

    ngOnInit(): void {
        this.setupApiKey = this.preferencesService.apiKey;
        this.setupApiSecret = this.preferencesService.apiSecret;

        this.isSetupWorking()
            .then(() => this.shouldShowSetup = false)
            .catch(() => this.shouldShowSetup = true);
    }

    protected isSetupWorking(): Promise<any> {
        this.krakenService.setup(this.setupApiKey, this.setupApiSecret);
        return this.krakenService.api('TradeBalance', { 'asset': 'EUR' });
    }

    public showSetupHandler() {
        this.shouldShowSetup = true;
    }

    public validateSetupHandler() {
        this.isSetupWorking()
            .then(() => {
                this.notificationService.success('Success', `Setup complete !`);
                this.shouldShowSetup = false;
                this.preferencesService.set(this.setupApiKey, this.setupApiSecret);
            })
            .catch(() => {
                this.notificationService.error('Invalid Keys', 'Please verify your inputs');
            });
    }
}
