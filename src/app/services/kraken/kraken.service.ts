import * as CryptoJS from 'crypto-js';
import { HttpClient } from '@angular/common/http';
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
            url: 'https://api.kraken.com',
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

        let headers = {
            'API-Key': this.config.key,
            'API-Sign': signature
        };

        return this.rawRequest(url, headers, params);
    }

	/**
	 * This method returns a signature for a request as a Base64-encoded string
	 * @param  {String}  path    The relative URL path for the request
	 * @param  {Object}  request The POST body
	 * @param  {Integer} nonce   A unique, incrementing integer
	 * @return {String}          The request signature
	 */
    public getMessageSignature(path, request, nonce) {
        // API-Sign = Message signature using HMAC-SHA512 of
        // (URI path + SHA256(nonce + POST data)) and base64 decoded secret API key

        let message = JSON.stringify(request);
        let c = CryptoJS;
        let hashDigest = CryptoJS.SHA256(nonce + message).toString(CryptoJS.enc.Hex);
        let hmacDigest = CryptoJS.SHA512(path + hashDigest).toString(CryptoJS.enc.Base64);

        return hmacDigest;
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

            headers['User-Agent'] = 'Kraken-MenuBar 0.0.1';
            let opts = {
                headers: headers,
                params: params
            };

            this.http.post(url, opts).subscribe((data: any) => {
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
