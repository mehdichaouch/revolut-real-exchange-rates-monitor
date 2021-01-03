let base_config = {
    "currencyFrom": "CHF",
    "currencyTo": "EUR",
    "notifications": 1,
    "portfolio": 1,
    "refreshDelay": 30,
    "colorChange": 1,
    "badgePortfolioConversion": 0,
    "roundBadge": 0,
    "badgeTextAnimate": 0,
    "soundNotification": 1,
    "soundSample": "mute",
    "targetPrice": {
        "EUR": 0,
        "CHF": 0
    },
    "panicPrice": {
        "EUR": 0,
        "CHF": 0
    },
    "portfolioValue": {
        "EUR": 0,
        "CHF": 0
    },
    "curs": {
        0: 'EUR',
        1: 'CHF'
    },
    "chartPeriod": "1d"
};

window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})();

let isIE = /*@cc_on!@*/false || !!document.documentMode;
let isEdge = !isIE && !!window.StyleMedia;
let isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

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

function initializeConfig(configuration) {
    if ("undefined" === typeof localStorage.trulyReallyTrulyBeenHereBefore) {
        localStorage.setItem("currencyFrom", configuration.currencyFrom);
        localStorage.setItem("currencyTo", configuration.currencyTo);
        localStorage.setItem("notifications", configuration.notifications);
        localStorage.setItem("portfolio", configuration.portfolio);
        localStorage.setItem("refreshDelay", configuration.refreshDelay * 1000);
        localStorage.setItem("colorChange", configuration.colorChange);
        localStorage.setItem("badgePortfolioConversion", configuration.badgePortfolioConversion);
        localStorage.setItem("roundBadge", configuration.roundBadge);
        localStorage.setItem("badgeTextAnimate", configuration.badgeTextAnimate);
        localStorage.setItem("soundNotification", configuration.soundNotification);
        localStorage.setItem("soundSample", configuration.soundSample);
        localStorage.setItem("targetPrice", JSON.stringify(configuration.targetPrice));
        localStorage.setItem("panicPrice", JSON.stringify(configuration.panicPrice));
        localStorage.setItem("portfolioValue", JSON.stringify(configuration.portfolioValue));
        localStorage.setItem("curs", JSON.stringify(configuration.curs));
        localStorage.setItem("chartPeriod", configuration.chartPeriod);
        localStorage.setItem("lastPrice", 0);
        localStorage.setItem("trulyReallyTrulyBeenHereBefore", "yes");
    }

    setInterval(updateTicker, localStorage.refreshDelay);
}

function getJSON(url, callback) {
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            let data = JSON.parse(request.responseText);
            callback(data);
        }
    };

    request.onerror = function (error) {
        console.log("Revolut does not respond.");
    };

    request.send();
}

function updateTicker() {
    getJSON(
        "https://www.revolut.com/api/quote/public/" + localStorage.currencyFrom + localStorage.currencyTo,
        function (data) {
            let price = data.rate;
            let badgeText = price.toString();
            let defaultColor = "#00ACE2";
            setBadgeColor(defaultColor);

            if (parseInt(localStorage.colorChange)) {
                if (parseFloat(price) > localStorage.lastPrice) {
                    setBadgeColor("#2B8F28");
                    setTimeout(function () {
                        setBadgeColor(defaultColor);
                    }, 4000);
                } else if (parseFloat(price) < localStorage.lastPrice) {
                    setBadgeColor("#FF4143");
                    setTimeout(function () {
                        setBadgeColor(defaultColor);
                    }, 4000);
                }
            }

            if (parseInt(localStorage.badgePortfolioConversion)) {
                let portfolioValue = JSON.parse(localStorage.portfolioValue);
                let val = portfolioValue[localStorage.currencyFrom];
                badgeText = (val * price).toString();
            }

            if (parseInt(localStorage.roundBadge)) {
                let firstCharZero = (1 > parseFloat(badgeText)) ? 1 : 0;
                let badgeMaxLength = 5;
                if ((firstCharZero + badgeMaxLength) < badgeText.length) {
                    badgeText = parseFloat(badgeText).toFixed(3 + firstCharZero);
                }
                if ((firstCharZero + badgeMaxLength) < badgeText.length) {
                    badgeText = parseFloat(badgeText).toFixed(2 + firstCharZero);
                }
                if ((firstCharZero + badgeMaxLength) < badgeText.length) {
                    badgeText = parseFloat(badgeText).toFixed(1 + firstCharZero);
                }
                if ((firstCharZero + badgeMaxLength) < badgeText.length) {
                    badgeText = parseFloat(badgeText).toFixed(firstCharZero);
                }

                badgeText = badgeText.toString().substring(firstCharZero, firstCharZero + badgeMaxLength);
            }

            if (isEdge) {
                badgeText = badgeText.substring(0, 4);
            }

            browser.browserAction.setBadgeText({text: badgeText});
            localStorage.lastPrice = price;

            if (parseInt(localStorage.badgeTextAnimate)) {
                let animator = new BadgeTextAnimator({
                    text: badgeText, // text to be scrolled (or animated)
                    interval: 500, // the "speed" of the scrolling
                    repeat: false, // repeat the animation or not
                    size: 6 // size of the badge
                });

                animator.animate();
            }
        }
    );

    if (isChrome) {
        notificationManager();
    }
}

function notificationManager() {
console.log('notificationManager 1');
    if (!parseInt(localStorage.notifications)) {
        console.log('notificationManager return');
        return;
    }
console.log('notificationManager 2');

    let keysNb = Object.keys(JSON.parse(localStorage.curs)).length;
console.log(keysNb);
console.log(localStorage.curs);
console.log(localStorage);
    for (let i = 0; i < keysNb; i++) {
        // console.log("https://www.revolut.com/api/quote/internal?symbol=" + JSON.parse(localStorage.curs)[i] + localStorage.currencyTo);


        // getJSON(
        //     "https://www.revolut.com/api/quote/internal?symbol=" + JSON.parse(localStorage.curs)[i] + localStorage.currencyTo,
        //     function (data) {
        //         let price = data[0].rate;
        //         let panicPrice = JSON.parse(localStorage.panicPrice);
        //         let targetPrice = JSON.parse(localStorage.targetPrice);
        //         let cur = data[0].base;
        //
        //         if (parseFloat(price) > targetPrice[cur] && targetPrice[cur] > 0) {
        //             createNotification(browser.i18n.getMessage("strOver"), targetPrice[cur]);
        //         } else if (parseFloat(price) < panicPrice[cur] && panicPrice[cur] > 0) {
        //             createNotification(browser.i18n.getMessage("strUnder"), panicPrice[cur]);
        //         }
        //     }
        // );
    }
}

function setBadgeColor(color) {
    browser.browserAction.setBadgeBackgroundColor({color: color});
}

function createNotification(sentence, value) {
    let myNotificationID = null;

    browser.notifications.create("price", {
        type: "basic",
        title: localStorage.currencyTo + "" + sentence + "" + value,
        message: localStorage.currencyTo + browser.i18n.getMessage("notifTxt") + value,
        iconUrl: "/img/icon128.png",
        buttons: [
            {
                title: browser.i18n.getMessage("revolutBtn"),
                iconUrl: "/img/icon16.png"
            }
        ]
    }, function (id) {
        myNotificationID = id;
    });

    if (parseFloat(localStorage.soundNotification) !== 0) {
        audioNotif();
    }
}

function audioNotif() {
    let notif = new Audio("sounds/" + localStorage.soundSample + ".mp3");
    notif.play();
}

function startExtensionListeners() {
    browser.extension.onMessage.addListener(
        function (request, sender, sendResponse) {
            if ("resetTicker" == request.msg) {
                updateTicker();
            }
        }
    );

    browser.notifications.onButtonClicked.addListener(function (notifId, btnIdx) {
        browser.tabs.create({url: "https://www.revolut.com/en-US/send-money-abroad"});
    });
}

initializeConfig(base_config);
analytics();
updateTicker();
startExtensionListeners();
