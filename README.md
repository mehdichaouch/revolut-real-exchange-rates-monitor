# Revolut Real Exchange Rates Monitor Extension (rrerm)

Track Revolut currency exchange to get best rate when you transfer.

Available soon on the [Chrome Web Store](https://github.com/mehdichaouch/revolut-real-exchange-rates-monitor/).

Compatible with Google Chrome, Mozilla Firefox, Microsoft Edge, Opera, Vivaldi & Brave!

* Track currency prices in all currencies supported by Revolut;
* Popup with spotrate, buy and sell prices;
* Price charts for last hour, day, week, month or year (not available for all currencies);
* Live update on icon with customizable delay and color changes;
* Set "up" and "low" notifications with sound;
* Optional portfolio feature to track your balance for each currency.

![alt tag](https://raw.githubusercontent.com/mehdichaouch/revolut-real-exchange-rates-monitor/master/img/screenshot.png)

## APIs

* Ticker & charts data by [Revolut API](https://www.revolut.com/api)

## Building

* Install packages with `npm install`
* `grunt build` to update *rrerm_release* folder
* `grunt pack` to pack *rrerm_release* folder
* `grunt release` to update and pack *rrerm_release* folder

## Installation

### Google Chrome

* *Google Chrome* -> *More tools* -> *Extensions* -> *Activate Developer Mode* -> *Load Unpacked Extension* and select the *rrerm_release* folder.

### Mozilla Firefox

* Navigate to *about:debugging*, click on *Load Temporary Add-on* and select the *manifest.json* file.

### Microsoft Edge

* Navigate to *about:flags* and check *Enable extension developer features*;
* Click on *…* in the Edge’s bar -> *Extensions* -> *Load extension* and select *rrerm_release* folder;
* Click on this freshly loaded extension and enable the *Show button next to the address bar*.

### Opera

* Navigate to *about://extensions* and click on the *Developer mode* button;
* Click on *Load unpacked extension…* and choose the *rrerm_release* folder.

### Vivaldi

* Navigate to *vivaldi://extensions* and enable the *Developer mode*;
* Click on *Load unpacked extension…* and choose the *rrerm_release* folder.

### Brave

* You need to build your own version of Brave to be able to use extensions;
* Visit [Davrous website](https://www.davrous.com/2016/12/07/creating-an-extension-for-all-browsers-edge-chrome-firefox-opera-brave/) for more infos on how building your own.

## Thanks to…

* https://github.com/BobRazowsky/coinbaseTicker

## License

MIT © [mehdichaouch](https://github.com/mehdichaouch)

## To do

* [x] Add missing currency
* [ ] Notifications
* [ ] Analytics
* [ ] Flags (see https://www.xe.com/ / https://github.com/hjnilsson/country-flags / https://github.com/lipis/flag-icon-css/ / https://github.com/matiassingers/emoji-flags)
* [ ] Refactoring for Javascript sharing function (see https://stackoverflow.com/questions/22738470/chrome-extension-js-sharing-functions-between-background-js-and-popup-js / https://developer.chrome.com/extensions/samples#search:build)
* [ ] CI (see https://github.com/openpgpjs/openpgpjs)
