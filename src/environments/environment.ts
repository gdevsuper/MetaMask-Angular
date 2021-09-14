// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

require('dotenv').config();

export const environment = {
  production: false,
  API_BASE_URL: 'http://147.182.187.164:3001/v1/',
  IMG_BASE_URL: 'http://147.182.187.164:3001/',
  CONTRACT_ADDRESS: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
  OWNER_ADDRESS: '0x631822399789E4BcFa1EfF1dffBf07cb99441FDC',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
