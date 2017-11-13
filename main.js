const menubar = require('menubar');

const key = '';
const secret = '';

const KrakenClient = require('kraken-api');
const kraken = new KrakenClient(key, secret);

const AutoLaunch = require('auto-launch');


function refreshBalance() {
    kraken.api('TradeBalance', { 'asset': 'EUR' }, function (error, data) {
        if (error) {
            console.log(error);
        }
        else {
            mb.tray.setTitle(Math.round(data.result.eb) + '€');
            console.log('refreshed');
        }
    });

    setTimeout(refreshBalance, 60000);
}

var mb = menubar();
mb.on('ready', function ready() {
    mb.tray.setTitle('pending');
    refreshBalance();

    new AutoLaunch({
        name: 'KrakenMenubar',
        path: '/Applications/KrakenMenubar.app'
    }).enable();
});
