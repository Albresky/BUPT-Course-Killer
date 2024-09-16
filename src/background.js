chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        var url = details.url;
        console.log('url: ' + url);

        if (url === "http://10.3.255.31/js/lhgdialog/lhgdialog.min.js?self=true") {
            console.log(`Redirecting: ${url} => ${chrome.extension.getURL('scripts/lhgdialog.min.js')}`);
            return { redirectUrl: chrome.extension.getURL('scripts/lhgdialog.min.js') };
        }

        return { redirectUrl: url };
    },
    { urls: ["*://10.3.255.31/*"] },
    ["blocking"]
);
