import { Component } from '@angular/core';
import { KrakenService } from '../../services/kraken/kraken.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.component.html',
    styleUrls: ['./home.page.component.scss']
})


export class HomePageComponent {
    protected krakenClient: any;

    constructor(protected krakenService: KrakenService) {
        let key = window.localStorage.getItem('key') || '';
        let secret = window.localStorage.getItem('secret') || '';

        krakenService.setup(key, secret);


        krakenService.api('TradeBalance', { 'asset': 'EUR' })
            .then((data) => {
                console.log('yo');
            });
    }

}