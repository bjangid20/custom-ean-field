# what is this?

This widget provides ean toggle option to do scan from barcode or user can type and validate if it correct or not?

# Installation

`npm i custom-ean-field --save`

Then ...

```
import {EanValidationField} from 'custom-ean-field';

<EanValidationField
  ean={ean} //mandatory
  callback={callback} //mandatory
  data={data} // optional
  disable={boolean} // optional
/>

```

# options

custom-ean-field supports four options in which ean and callback are mandatory and other are optional

- _ean_ - This value is mandatory as the validation is based on this value.

- _callback_ - callback is mandatory as based on this we have to set parent state.
