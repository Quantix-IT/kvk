/// <reference types="node" />
import https from 'node:https';
export declare class KVK {
    apiKey: string;
    baseUrl: string;
    certificate: string;
    httpsAgent: https.Agent;
    constructor(apiKey: string, baseUrl?: string | null, certificate?: string | null, httpsAgent?: https.Agent | null);
    getCertificate(): string;
    createHttpsAgent(): https.Agent;
    static validateKvkNummer(val: string): boolean;
    static validateVestigingsnummer(val: string): boolean;
    request({ endpoint, params, headers, }: {
        endpoint: string;
        params?: object;
        headers?: object;
    }): Promise<any>;
    /**
   * @deprecated This function is deprecated and will be removed in a future version.
   * The KVK api will stop supporting searching on the V1 endpoint starting 29-07-2024
   * Use [zoekenV2] instead.
   */
    zoeken({ kvkNummer, vestigingsnummer, postcode, huisnummer, pagina, aantal, ...params }: {
        kvkNummer?: string;
        rsin?: string;
        vestigingsnummer?: string;
        handelsnaam?: string;
        straatnaam?: string;
        plaats?: string;
        postcode?: string;
        huisnummer?: string;
        huisnummerToevoeging?: string;
        type?: 'hoofdvestiging' | 'nevenvestiging' | 'rechtspersoon';
        InclusiefInactieveRegistraties?: boolean;
        pagina?: number;
        aantal?: number;
    }): Promise<any>;
    zoekenV2({ kvkNummer, vestigingsnummer, postcode, huisnummer, pagina, resultatenPerPagina, ...params }: {
        kvkNummer?: string;
        rsin?: string;
        vestigingsnummer?: string;
        naam?: string;
        straatnaam?: string;
        plaats?: string;
        postcode?: string;
        huisnummer?: string;
        huisletter?: string;
        type?: 'hoofdvestiging' | 'nevenvestiging' | 'rechtspersoon';
        InclusiefInactieveRegistraties?: boolean;
        pagina?: number;
        resultatenPerPagina?: number;
    }): Promise<any>;
    basisprofiel(kvkNummer: string, geoData?: boolean): Promise<any>;
    basisprofielEigenaar(kvkNummer: string, geoData?: boolean): Promise<any>;
    basisprofielHoofdvestiging(kvkNummer: string, geoData?: boolean): Promise<any>;
    basisprofielVestigingen(kvkNummer: string): Promise<any>;
    vestigingsprofiel(vestigingsnummer: string, geoData?: boolean): Promise<any>;
    naamgeving(kvkNummer: string): Promise<any>;
}
export default KVK;
//# sourceMappingURL=index.d.ts.map