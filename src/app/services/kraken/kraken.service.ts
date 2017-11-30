
import * as CryptoJS from 'crypto-js';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class KrakenService {
    protected config: any;

    constructor(protected http: HttpClient) { }

    /**
     * KrakenClient connects to the Kraken.com API
     * @param {String} key    API Key
     * @param {String} secret API Secret
     */
    public setup(key, secret) {
        this.config = {
            url: '/api',
            version: '0',
            key: key,
            secret: secret,
            timeoutMS: 5000
        };
    }

	/**
	 * This method makes a public or private API request.
	 * @param  {String}   method   The API method (public or private)
	 * @param  {Object}   params   Arguments to pass to the api call
	 * @param  {Function} callback A callback public to be executed when the request is complete
	 * @return {Object}            The request object
	 */
    public api(method, params): Promise<any> {
        let methods = {
            public: ['Time', 'Assets', 'AssetPairs', 'Ticker', 'Depth', 'Trades', 'Spread', 'OHLC'],
            private: [
                'Balance', 'TradeBalance', 'OpenOrders',
                'ClosedOrders', 'QueryOrders', 'TradesHistory',
                'QueryTrades', 'OpenPositions', 'Ledgers', 'QueryLedgers',
                'TradeVolume', 'AddOrder', 'CancelOrder', 'DepositMethods',
                'DepositAddresses', 'DepositStatus', 'WithdrawInfo', 'Withdraw',
                'WithdrawStatus', 'WithdrawCancel']
        };
        if (methods.public.indexOf(method) !== -1) {
            return this.publicMethod(method, params);
        } else if (methods.private.indexOf(method) !== -1) {
            return this.privateMethod(method, params);
        } else {
            throw new Error(method + ' is not a valid API method.');
        }
    }

	/**
	 * This method makes a public API request.
	 * @param  {String}   method   The API method (public or private)
	 * @param  {Object}   params   Arguments to pass to the api call
	 * @param  {Function} callback A callback public to be executed when the request is complete
	 * @return {Object}            The request object
	 */
    public publicMethod(method, params): Promise<any> {
        params = params || {};

        let path = '/' + this.config.version + '/public/' + method;
        let url = this.config.url + path;

        return this.rawRequest(url, {}, params);
    }

	/**
	 * This method makes a private API request.
	 * @param  {String}   method   The API method (public or private)
	 * @param  {Object}   params   Arguments to pass to the api call
	 * @param  {Function} callback A callback public to be executed when the request is complete
	 * @return {Object}            The request object
	 */
    public privateMethod(method, params): Promise<any> {
        params = params || {};

        let path = '/' + this.config.version + '/private/' + method;
        let url = this.config.url + path;

        params.nonce = (new Date() as any) * 1000; // spoof microsecond

        let signature = this.getMessageSignature(path, params, params.nonce);

        let headers = new HttpHeaders();
        headers = headers.set('API-Key', this.config.key);
        headers = headers.set('API-Sign', signature);
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');

        // headers = headers.set('user-agent', 'Kraken Javascript API Client');

        return this.rawRequest(url, headers, params);
    }

	/**
     * from https://stackoverflow.com/questions/45856413/angular4-typescript-sign-kraken-api-call-cryptojs/46753240#46753240
	 * This method returns a signature for a request as a Base64-encoded string
	 * @param  {String}  path    The relative URL path for the request
	 * @param  {Object}  request The POST body
	 * @param  {Integer} nonce   A unique, incrementing integer
	 * @return {String}          The request signature
	 */
    private getMessageSignature(path: string, params: any, nonce: number) {
        let apiSecret = this.config.secret;

        let request = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
        const secret = CryptoJS.enc.Base64.parse(apiSecret);
        const hashDigest = CryptoJS.SHA256(nonce + request);

        const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA512, secret);
        hmac.update(path);
        hmac.update(hashDigest);

        let c = CryptoJS.enc.Base64.stringify(hmac.finalize());
        return c;
    }


	/**
	 * This method sends the actual HTTP request
	 * @param  {String}   url      The URL to make the request
	 * @param  {Object}   headers  Request headers
	 * @param  {Object}   params   POST body
	 * @param  {Function} callback A callback public to call when the request is complete
	 * @return {Object}            The request object
	 */
    public rawRequest(url, headers, params): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');

            this.http.post(url, body, { headers: headers }).subscribe((data: any) => {
                // If any errors occured, Kraken will give back an array with error strings under
                // the key "error". We should then propagate back the error message as a proper error.
                if (data.error && data.error.length) {
                    console.error(data.error);
                    reject(data.error);
                } else {
                    resolve(data);
                }

            });
        });
    }
}
