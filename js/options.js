document.addEventListener('DOMContentLoaded', function () {

    let isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    let isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    let isFirefox = typeof InstallTrigger !== 'undefined';
    let isIE = /*@cc_on!@*/false || !!document.documentMode;
    let isEdge = !isIE && !!window.StyleMedia;

    startListeners();
    translate();
    analytics();
    populateCurrencies();

    if (isOpera || isFirefox || isIE || isEdge) {
        hideUselessFields();
    }
});

function startListeners() {
    document.querySelector('select[name="currencyFrom"]').onchange = updateCurrencyFrom;
    document.querySelector('button[name="switchCurrency"]').onclick = switchCurrency;
    document.querySelector('select[name="currencyTo"]').onchange = updateCurrencyTo;
    document.querySelector('input[name="notifOptns"]').onclick = toggleNotif;
    document.querySelector('input[name="portfolioOptns"]').onclick = togglePortfolio;
    document.querySelector('input[name="badgePortfolioConversionOptns"]').onclick = toggleBadgePortfolioConversionOptns;
    document.querySelector('input[name="refreshDelay"]').onchange = updateRefreshDelay;
    document.querySelector('input[name="colorChange"]').onclick = toggleColorChange;
    document.querySelector('input[name="roundBadge"]').onclick = toggleRoundBadge;
    document.querySelector('input[name="badgeTextAnimate"]').onclick = toggleBadgeTextAnimate;
    document.querySelector('select[name="soundSample"]').onchange = updateSoundSample;
    document.getElementById("save").onclick = saveAndApply;
}

function translate() {
    document.title = browser.i18n.getMessage("settingsBtn");
    ["strCurrencyFrom", "strCurrencyTo", "strNotifOptns", "strPortfolio", "strBadgePortfolioConversion", "strRefreshDelay", "strSeconds", "strColorChange", "strRoundBadge", "strBadgeTextAnimate", "strSound", "save"].forEach(function (el) {
        document.getElementById(el).innerHTML = browser.i18n.getMessage(el);
    });
}

function analytics() {
    let _gaq = [];
    _gaq.push(['_setAccount', 'UA-XXXXXXXXX-1']);
    _gaq.push(['_trackPageview']);

    (function () {
        let ga = document.createElement('script');
        ga.type = 'text/javascript';
        ga.async = true;
        ga.src = 'https://ssl.google-analytics.com/ga.js';
        let s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
    })();
}

function populateCurrencies() {
    let currency = '[{"id": "AED", "name": "AED - United Arab Emirates"}, {"id": "AUD", "name": "AUD - Australian Dollar"}, {"id": "BCH", "name": "BCH - Bitcoin Cash"}, {"id": "BTC", "name": "BTC - Bitcoin"}, {"id": "CAD", "name": "CAD - Canadian Dollar"}, {"id": "CHF", "name": "CHF - Swiss Franc"}, {"id": "CZK", "name": "CZK - Czech Koruna"}, {"id": "DKK", "name": "DKK - Danish Krone"}, {"id": "ETH", "name": "ETH - Ether"}, {"id": "EUR", "name": "EUR - Euro"}, {"id": "GBP", "name": "GBP - British Pound"}, {"id": "HKD", "name": "HKD - Hong Kong Dollar"}, {"id": "HUF", "name": "HUF - Hungarian Forint"}, {"id": "ILS", "name": "ILS - Israeli New Sheqel"}, {"id": "JPY", "name": "JPY - Japanese Yen"}, {"id": "LTC", "name": "LTC - Litecoin"}, {"id": "MAD", "name": "MAD - Morocco"}, {"id": "NOK", "name": "NOK - Norwegian Krona"}, {"id": "NZD", "name": "NZD - New Zealand Dollar"}, {"id": "PLN", "name": "PLN - Polish Zloty"}, {"id": "QAR", "name": "QAR - Qatari Riyal"}, {"id": "RON", "name": "RON - Romanian Leu"}, {"id": "SEK", "name": "SEK - Swedish Krona"}, {"id": "SGD", "name": "SGD - Singapore Dollar"}, {"id": "THB", "name": "THB - Thai Baht"}, {"id": "TRY", "name": "TRY - Turkish Lira"}, {"id": "USD", "name": "USD - US Dollar"}, {"id": "XRP", "name": "XRP - Ripple"}, {"id": "ZAR", "name": "ZAR - South African Rand"}]';
    currency = JSON.parse(currency);
    let selectFrom = document.querySelector('select[name="currencyFrom"]');
    let selectTo = document.querySelector('select[name="currencyTo"]');
    for (let i = 0; i < currency.length; i++) {
        let opt = document.createElement('option');
        opt.value = currency[i].id;
        opt.innerHTML = currency[i].name;
        selectFrom.appendChild(opt);
    }
    selectTo.innerHTML = selectFrom.innerHTML;

    updateValues();
}

function updateCurrencyFrom(event) {
    localStorage.currencyFrom = event.target.value;
}

function switchCurrency() {
    let tmp = localStorage.currencyFrom;
    localStorage.currencyFrom = localStorage.currencyTo;
    localStorage.currencyTo = tmp;
    updateValues();
    $('#currencyFrom').selectpicker('refresh');
    $('#currencyTo').selectpicker('refresh');
}

function updateCurrencyTo(event) {
    localStorage.currencyTo = event.target.value;
}

function toggleNotif(event) {
    localStorage.notifications = (event.target.checked === true) ? 1 : 0;
}

function togglePortfolio(event) {
    localStorage.portfolio = (event.target.checked === true) ? 1 : 0;
}

function toggleBadgePortfolioConversionOptns(event) {
    localStorage.badgePortfolioConversion = (event.target.checked === true) ? 1 : 0;
}

function updateRefreshDelay(event) {
    let value = (event.target.value < 1) ? 1 : event.target.value;
    localStorage.refreshDelay = value * 1000;
}

function toggleColorChange(event) {
    localStorage.colorChange = (event.target.checked === true) ? 1 : 0;
}

function toggleRoundBadge(event) {
    localStorage.roundBadge = (event.target.checked === true) ? 1 : 0;
    browser.extension.sendMessage({msg: "resetTicker"});
}

function toggleBadgeTextAnimate(event) {
    localStorage.badgeTextAnimate = (event.target.checked === true) ? 1 : 0;
}

function hideUselessFields() {
    document.querySelector('div[id="soundOptn"]').style.visibility = "hidden";
}

window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})();

function updateValues() {
    document.querySelector('select[name="currencyFrom"]').value = localStorage.currencyFrom;
    document.querySelector('select[name="currencyTo"]').value = localStorage.currencyTo;
    document.querySelector('input[name="notifOptns"]').checked = (localStorage.notifications === "1");
    document.querySelector('input[name="portfolioOptns"]').checked = (localStorage.portfolio === "1");
    document.querySelector('input[name="badgePortfolioConversionOptns"]').checked = (localStorage.badgePortfolioConversion === "1");
    document.querySelector('input[name="refreshDelay"]').value = localStorage.refreshDelay / 1000;
    document.querySelector('input[name="colorChange"]').checked = (localStorage.colorChange === "1");
    document.querySelector('input[name="roundBadge"]').checked = (localStorage.roundBadge === "1");
    document.querySelector('input[name="badgeTextAnimate"]').checked = (localStorage.badgeTextAnimate === "1");
    document.querySelector('select[name="soundSample"]').value = localStorage.soundSample;
}

function updateSoundSample(event) {
    localStorage.soundSample = event.target.value;
    if (event.target.value === "mute") {
        localStorage.soundNotification = 0;
    } else {
        localStorage.soundNotification = 1;
        let sound = new Audio("sounds/" + event.target.value + ".mp3");
        sound.play();
    }
}

function getJSON(url, callback) {
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            let data = JSON.parse(request.responseText);
            callback(data, request);
        }
    };
    request.onerror = function () {
    };
    request.send();
}

function saveAndApply() {
    browser.extension.sendMessage({msg: "resetTicker"});
}
