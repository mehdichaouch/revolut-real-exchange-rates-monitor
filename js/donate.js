function initialize() {
    startListeners();
    translate();
    analytics();
}

window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})();

function startListeners() {
    ["btcAddress", "bchAddress", "ethAddress", "etcAddress", "ltcAddress", "zrxAddress", "batAddress", "usdcAddress"].forEach(function (el) {
        document.getElementById(el).addEventListener("click", function () {
            copyAddressToClipboard(this.id);
        });
    });
}

function translate() {
    document.title = browser.i18n.getMessage("strDonations");
    ["strFollow1", "strFollow2", "strDonations", "strDonationsTxt"].forEach(function (el) {
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

function copyAddressToClipboard(addressId) {
    let element = document.getElementById(addressId);

    if ((" " + element.className + " ").indexOf(" " + "success" + " ") > -1) {
        return;
    }

    let address = element.innerHTML;
    let selection = window.getSelection();
    let range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);

    try {
        let successful = document.execCommand("copy");
        if (document.selection) {
            document.selection.empty();
        } else if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
        element.classList.add("success");
        element.innerHTML = browser.i18n.getMessage("strCopied");
        setTimeout(function () {
            element.classList.remove("success");
            element.innerHTML = address;
        }, 1000);
    } catch (err) {
        console.log("Unable to copy");
    }
}

initialize();
