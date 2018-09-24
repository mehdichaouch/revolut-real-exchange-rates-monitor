document.addEventListener('DOMContentLoaded', function () {

    let isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    let isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    let isFirefox = typeof InstallTrigger !== 'undefined';
    let isIE = /*@cc_on!@*/false || !!document.documentMode;
    let isEdge = !isIE && !!window.StyleMedia;

    let displayPortfolio = localStorage.portfolio;
    let displayNotification = localStorage.notifications;
    startListeners();
    translate();
    analytics();
    getChartValues();
    togglePortfolio(displayPortfolio.toString());
    toggleNotifications(displayNotification.toString());
    loadLocalStorageIntoInputValue();
    updatePrices();
    updatePortfolio();
    changeCurrencyIcon();

    if (isOpera || isFirefox || isIE || isEdge) {
        hideUselessFields();
    }
});

window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})();

function startListeners() {
    document.querySelector('select[name="chartPeriod"]').onchange = function (e) {
        this.blur();
        updateChartPeriod(e);
    };

    document.querySelector('th[name="ico"').onclick = rollCurrency;

    let inputTags = ["targetPrice", "panicPrice", "portfolioValue"];
    inputTags.forEach(function (name) {
        document.querySelector('input[name="' + name + '"]').onkeyup = updateLocalStorageFromInputValue;
    });

    document.getElementById("settingsBtn").onclick = function () {
        browser.tabs.create({url: "views/options.html"});
    };
}

function translate() {
    let labels = ["strSpotrate", "strTargetPrice", "strPanicPrice", "str1d", "str5d", "str1mo", "str3mo", "str6mo", "str1y", "str2y", "str5y", "strYtd", "strMax", "revolutBtn", "settingsBtn", "donateBtn"];

    labels.forEach(function (label) {
        if (null != document.getElementById(label)) {
            document.getElementById(label).innerHTML = browser.i18n.getMessage(label);
        } else {
            console.log(label + " not found.")
        }
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

    document.getElementById("revolutBtn").onclick = function () {
        _gaq.push(['_trackEvent', "revolutButton", 'clicked']);
    }.bind(this);

    document.getElementById("settingsBtn").onclick = function () {
        browser.tabs.create({url: "views/options.html"});
        _gaq.push(['_trackEvent', "settingsButton", 'clicked']);
    }.bind(this);

    document.getElementById("donateBtn").onclick = function () {
        browser.tabs.create({url: "views/donate.html"});
        _gaq.push(['_trackEvent', "donateButton", 'clicked']);
    }.bind(this);
}

function getChartValues() {
    let mappingRangeInterval = {
        "1d": "15m",
        "5d": "30m",
        "1mo": "1h",
        "3mo": "1d",
        "6mo": "5d",
        "1y": "5d",
        "2y": "1wk",
        "5y": "1wk",
        "ytd": "1wk",
        "max": "1wk"
    };

    let range = localStorage.chartPeriod;
    let interval = mappingRangeInterval[range];
    let chartsData = [];

    getJSON(
        "https://www.revolut.com/api/history/" + localStorage.currencyFrom + localStorage.currencyTo + '=X?range=' + range + '&interval=' + interval,
        function (data, request) {
            if (!!data.chart.error || "undefined" == typeof data.chart.result[0].timestamp) {
                console.log("https://www.revolut.com/api/history/" + localStorage.currencyFrom + localStorage.currencyTo + '=X?range=' + range + '&interval=' + interval);
                console.log("No chart data for this currency");
                document.getElementById("chart").style.display = "none";
                return;
            }
            let el = data.chart.result[0].timestamp.length;
            let quote = data.chart.result[0].indicators.quote[0];
            for (let i = 0; i < el; i++) {
                let close = quote.close[i];
                let open = quote.open[i];
                if (!close || !open) {
                    continue;
                }

                chartsData.push({x: i * (200 / el), y: (close + open) / 2});
            }

            buildChart(chartsData);

            let indexEnd = el - 1;
            let start = (quote.close[0] + quote.open[0]) / 2;
            let end = (quote.close[indexEnd] + quote.open[indexEnd]) / 2;
            let change = ((100 * end) / start) - 100;

            let sign = (change > 0) ? "+" : "";
            let color = (change > 0) ? "#2B8F28" : "#FF4143";

            document.querySelector('#changeValue').innerHTML = sign + change.toFixed(2) + "%";
            document.querySelector('#changeValue').style.color = color;
        }
    );
}

function buildChart(chartsData) {
    let ctx = document.getElementById("chartCanvas");

    if (typeof priceChart !== "undefined") {
        priceChart.destroy();
    }

    priceChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: "price",
                        fill: false,
                        data: chartsData,
                        pointRadius: 0,
                        borderWidth: 2,
                        borderColor: "#2B71B1",
                        lineTension: 0.1
                    }
                ]
            },
            options: {
                legend: {
                    display: false
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        title: function () {
                            return '';
                        },
                        label: function (tooltipItem) {
                            return String(tooltipItem.yLabel).substring(0, 7);
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        display: false,
                        type: 'linear',
                        position: 'bottom'
                    }]
                },
                hover: {}
            }
        },
        {
            lineAtIndex: 2
        });
}

function togglePortfolio(state) {
    switch (state) {
        case "0":
            document.getElementById("portfolio").style.visibility = "hidden";
            document.getElementById("portfolio").style.height = "0px";
            document.getElementById("portfolio").style.marginTop = "0px";
            document.getElementById("portfolio").style.padding = "0px";
            document.getElementById("portfolio").style.display = "none";
            break;

        case "1":
            document.getElementById("portfolio").style.visibility = "visible";
            document.getElementById("portfolio").style.height = "auto";
            document.getElementById("portfolio").style.marginTop = "5px";
            break;

        default:
            console.log("error", state);
    }
}

function toggleNotifications(state) {
    switch (state) {
        case "0":
            document.getElementById("limitOptions").style.visibility = "hidden";
            document.getElementById("limitOptions").style.height = "0px";
            document.getElementById("limitOptions").style.marginTop = "0px";
            document.getElementById("limitOptions").style.padding = "0px";
            document.getElementById("limitOptions").style.display = "none";
            break;

        case "1":
            document.getElementById("limitOptions").style.visibility = "visible";
            document.getElementById("limitOptions").style.height = "auto";
            document.getElementById("limitOptions").style.marginTop = "5px";
            break;

        default:
            console.log("error", state);
    }
}

function loadLocalStorageIntoInputValue() {
    if (parseInt(localStorage.notifications)) {
        let targetPrice = JSON.parse(localStorage.targetPrice);
        document.querySelector('input[name="targetPrice"]').value = targetPrice[localStorage.currencyFrom];
        let panicPrice = JSON.parse(localStorage.panicPrice);
        document.querySelector('input[name="panicPrice"]').value = panicPrice[localStorage.currencyFrom];
    }

    if (parseInt(localStorage.portfolio)) {
        document.getElementById("tabletitle").innerHTML = localStorage.currencyFrom + " to " + localStorage.currencyTo;
        let portfolioValue = JSON.parse(localStorage.portfolioValue);
        document.querySelector('input[name="portfolioValue"]').value = portfolioValue[localStorage.currencyFrom];
        document.querySelector('select[name="chartPeriod"]').value = localStorage.chartPeriod;
    }
}

function updatePrices() {
    let priceString, price, priceRate;

    getJSON(
        "https://www.revolut.com/api/quote/internal?symbol=" + localStorage.currencyFrom + localStorage.currencyTo,
        function (data) {
            document.getElementById("priceNumbers").style.visibility = "visible";
            document.getElementById("error").style.visibility = "hidden";
            priceString = data[0].rate.toString();
            localStorage.lastSpot = data[0].rate;
            price = data[0].rate;
            priceRate = document.getElementById("priceRate");
            priceRate.innerHTML = priceString.toString();
            updatePortfolio();
        }
    );
}

function updatePortfolio() {
    let portfolioValue = JSON.parse(localStorage.portfolioValue);
    let val = portfolioValue[localStorage.currencyFrom];
    document.getElementById("portfolioConversion").innerHTML = (val * localStorage.lastSpot).toFixed(2) + " " + localStorage.currencyTo;
}

function updateTargetPrice(event){
    var targetPrice = JSON.parse(localStorage.targetPrice);
    targetPrice[localStorage.currencyFrom] = event.target.value;
    localStorage.targetPrice = JSON.stringify(targetPrice);
}

function updatePanicPrice(event){
    var panicPrice = JSON.parse(localStorage.panicPrice);
    panicPrice[localStorage.currencyFrom] = event.target.value;
    localStorage.panicPrice = JSON.stringify(panicPrice);
}

function changeCurrencyIcon() {
    if (localStorage.currencyTo === "GBP") {
        document.querySelector('img[name="currIco"]').src = "/img/eth16.png";
        document.querySelector('img[name="currIco2"]').src = "/img/eth16.png";
    } else if (localStorage.currencyTo === "EUR") {
        document.querySelector('img[name="currIco"]').src = "/img/btc16.png";
        document.querySelector('img[name="currIco2"]').src = "/img/btc16.png";
    } else if (localStorage.currencyTo === "USD") {
        document.querySelector('img[name="currIco"]').src = "/img/ltc16.png";
        document.querySelector('img[name="currIco2"]').src = "/img/ltc16.png";
    } else if (localStorage.currencyTo === "CHF") {
        document.querySelector('img[name="currIco"]').src = "/img/bch16.png";
        document.querySelector('img[name="currIco2"]').src = "/img/bch16.png";
    } else if (localStorage.currencyTo === "PLN") {
        document.querySelector('img[name="currIco"]').src = "/img/btc16.png";
        document.querySelector('img[name="currIco2"]').src = "/img/btc16.png";
    }
}

function rollCurrency() {
    let currencies = ["AED", "AUD", "BCH", "BTC", "CAD", "CHF", "CZK", "DKK", "ETH", "EUR", "GBP", "HKD", "HUF", "ILS", "JPY", "LTC", "MAD", "NOK", "NZD", "PLN", "QAR", "RON", "SEK", "SGD", "THB", "TRY", "USD", "XRP", "ZAR"];
    let currentCurrIndex = currencies.indexOf(localStorage.currencyTo);
    let nextIndex = currentCurrIndex + 1;
    if (nextIndex > (currencies.length - 1)) {
        nextIndex = 0;
    }
    localStorage.currencyTo = currencies[nextIndex];
    changeCurrencyIcon();
    updatePrices();
    getChartValues();
    loadLocalStorageIntoInputValue();
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
        document.getElementById("priceNumbers").style.visibility = "hidden";
        document.getElementById("error").style.visibility = "visible";
    };
    request.send();
}

function updateLocalStorageFromInputValue(event) {
    if (!event) event = window.event;
    let val = JSON.parse(localStorage[event.target.id]);
    val[localStorage.currencyFrom] = event.target.value;
    localStorage[event.target.id] = JSON.stringify(val);
    if ("portfolioValue" === event.target.id) {
        updatePortfolio(event);
    }
    if ("targetPrice" === event.target.id) {
        updateTargetPrice(event);
    }
    if ("panicPrice" === event.target.id) {
        updatePanicPrice(event);
    }
}

function hideUselessFields() {
    document.querySelector('div[id="limitOptions"]').style.visibility = "hidden";
    document.querySelector('div[id="limitOptions"]').style.height = "0px";
}

function updateChartPeriod(event) {
    localStorage.chartPeriod = event.target.value;
    getChartValues();
}
