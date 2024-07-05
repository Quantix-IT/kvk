import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import crypto from 'node:crypto';
import fetch from 'node-fetch';
const BASE_URL = 'https://api.kvk.nl/api';
const CERTIFICATE_PATH = '../../certs/Private_G1_chain.pem';
export class KVK {
    apiKey;
    baseUrl;
    certificate;
    httpsAgent;
    constructor(apiKey, baseUrl, certificate, httpsAgent) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl || BASE_URL;
        this.certificate = certificate || this.getCertificate();
        this.httpsAgent = httpsAgent || this.createHttpsAgent();
    }
    getCertificate() {
        const pathToCertificate = path.join(__dirname, CERTIFICATE_PATH);
        const certificate = fs.readFileSync(pathToCertificate, {
            encoding: 'utf-8',
        });
        return certificate;
    }
    createHttpsAgent() {
        const httpsAgent = new https.Agent({
            ca: this.certificate,
            secureOptions: crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION,
        });
        return httpsAgent;
    }
    static validateKvkNummer(val) {
        if (val.length !== 8)
            return false;
        return /^\d+$/.test(val);
    }
    static validateVestigingsnummer(val) {
        if (val.length !== 12)
            return false;
        return /^\d+$/.test(val);
    }
    async request({ endpoint, params = {}, headers = {}, }) {
        const query = new URLSearchParams({
            ...Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null)),
        }).toString();
        const url = this.baseUrl + endpoint + (query ? `?${query}` : '');
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                apiKey: this.apiKey,
                ...headers,
            },
            agent: this.httpsAgent,
        });
        const data = await res.json();
        return data;
    }
    /**
   * @deprecated This function is deprecated and will be removed in a future version.
   * The KVK api will stop supporting searching on the V1 endpoint starting 29-07-2024
   * Use [zoekenV2] instead.
   */
    async zoeken({ kvkNummer, vestigingsnummer, postcode, huisnummer, pagina = 1, aantal = 15, ...params }) {
        if (kvkNummer && !KVK.validateKvkNummer(kvkNummer))
            throw new Error('KVK: Ongeldig kvknummer.');
        if (vestigingsnummer && !KVK.validateVestigingsnummer(vestigingsnummer))
            throw new Error('KVK: Ongeldig vestigingsnummer.');
        if ((postcode && !huisnummer) || (huisnummer && !postcode))
            throw new Error('KVK: Postcode en huisnummer mogen alleen in combinatie met elkaar gebruikt worden.');
        if (pagina < 1 || pagina > 1000)
            throw new Error('KVK: Pagina is minimaal 1 en maximaal 1000.');
        if (aantal < 1 || aantal > 100)
            throw new Error('KVK: Aantal is minimaal 1 en maximaal 100.');
        return await this.request({
            endpoint: '/v1/zoeken',
            params: {
                kvkNummer,
                vestigingsnummer,
                postcode,
                huisnummer,
                pagina,
                aantal,
                ...params,
            },
        });
    }
    async zoekenV2({ kvkNummer, vestigingsnummer, postcode, huisnummer, pagina = 1, resultatenPerPagina = 15, ...params }) {
        if (kvkNummer && !KVK.validateKvkNummer(kvkNummer))
            throw new Error('KVK: Ongeldig kvknummer.');
        if (vestigingsnummer && !KVK.validateVestigingsnummer(vestigingsnummer))
            throw new Error('KVK: Ongeldig vestigingsnummer.');
        if ((postcode && !huisnummer) || (huisnummer && !postcode))
            throw new Error('KVK: Postcode en huisnummer mogen alleen in combinatie met elkaar gebruikt worden.');
        if (pagina < 1 || pagina > 1000)
            throw new Error('KVK: Pagina is minimaal 1 en maximaal 1000.');
        if (resultatenPerPagina < 1 || resultatenPerPagina > 100)
            throw new Error('KVK: Aantal is minimaal 1 en maximaal 100.');
        return await this.request({
            endpoint: '/v2/zoeken',
            params: {
                kvkNummer,
                vestigingsnummer,
                postcode,
                huisnummer,
                pagina,
                resultatenPerPagina,
                ...params,
            },
        });
    }
    async basisprofiel(kvkNummer, geoData) {
        if (kvkNummer && !KVK.validateKvkNummer(kvkNummer))
            throw new Error('KVK: Ongeldig kvknummer.');
        return await this.request({
            endpoint: `/v1/basisprofielen/${kvkNummer}`,
            params: {
                geoData,
            },
        });
    }
    async basisprofielEigenaar(kvkNummer, geoData) {
        if (kvkNummer && !KVK.validateKvkNummer(kvkNummer))
            throw new Error('KVK: Ongeldig kvknummer.');
        return await this.request({
            endpoint: `/v1/basisprofielen/${kvkNummer}/eigenaar`,
            params: {
                geoData,
            },
        });
    }
    async basisprofielHoofdvestiging(kvkNummer, geoData) {
        if (kvkNummer && !KVK.validateKvkNummer(kvkNummer))
            throw new Error('KVK: Ongeldig kvknummer.');
        return await this.request({
            endpoint: `/v1/basisprofielen/${kvkNummer}/hoofdvestiging`,
            params: {
                geoData,
            },
        });
    }
    async basisprofielVestigingen(kvkNummer) {
        if (kvkNummer && !KVK.validateKvkNummer(kvkNummer))
            throw new Error('KVK: Ongeldig kvknummer.');
        return await this.request({
            endpoint: `/v1/basisprofielen/${kvkNummer}/vestigingen`,
        });
    }
    async vestigingsprofiel(vestigingsnummer, geoData) {
        if (vestigingsnummer && !KVK.validateVestigingsnummer(vestigingsnummer))
            throw new Error('KVK: Ongeldig vestigingsnummer.');
        return await this.request({
            endpoint: `/v1/vestigingsprofielen/${vestigingsnummer}`,
            params: {
                geoData,
            },
        });
    }
    async naamgeving(kvkNummer) {
        if (kvkNummer && !KVK.validateKvkNummer(kvkNummer))
            throw new Error('KVK: Ongeldig kvknummer.');
        return await this.request({
            endpoint: `/v1/naamgevingen/kvkNummer/${kvkNummer}`,
        });
    }
}
export default KVK;
