## KVK client by Quantix

A library to use the kvk API.

### Installation and Usage

Installation:

```console
npm i @quantix-ict/kvk
```

Usage:

```javascript
const { KVK } = require('@quantix-ict/kvk')

const kvk = new KVK('API_KEY')

const data = await kvk.zoeken({
  kvkNummer: '82413096',
  aantal: 10,
  pagina: 1,
})
```

of using import:

```javascript
import { KVK } from '@quantix-ict/kvk'

const kvk = new KVK('API_KEY')

const data = await kvk.zoeken({
  kvkNummer: '82413096',
  aantal: 10,
  pagina: 1,
})
```

API-documentation can be found on the [kvk website](https://developers.kvk.nl/nl/support/oas-swagger).

'/zoeken'

```javascript
const data = await kvk.zoeken({
  kvkNummer: '82413096',
  aantal: 10,
  pagina: 1,
})
```

'/basisprofielen/{kvkNummer}'

```javascript
const data = await kvk.basisprofiel('82413096')
```

'/basisprofielen/{kvkNummer}/eigenaar'

```javascript
const data = await kvk.basisprofielEigenaar('82413096')
```

'/basisprofielen/{kvkNummer}/hoofdvestiging'

```javascript
const data = await kvk.basisprofielHoofdvestiging('82413096')
```

'/basisprofielen/{kvkNummer}/vestigingen'

```javascript
const data = await kvk.basisprofielVestigingen('82413096')
```

'/vestigingsprofiel/{vestigingsnummer}'

```javascript
const data = await kvk.vestigingsprofielen('112233445566')
```

'/naamgeving/kvknummer/{kvkNummer}'

```javascript
const data = await kvk.naamgeving('82413096')
```
