chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        var url = details.url;
        console.log('url: ' + url);
        
        var ip = url.split('/')[2];
        const allowedIPs = new Set(["10.3.255.30", "10.3.255.31", "10.3.255.32", "10.3.255.33"]);
        if (allowedIPs.has(ip) && url.includes("/js/lhgdialog/lhgdialog.min.js?self=true")) {
            console.log(`Redirecting: ${url} => ${chrome.extension.getURL('scripts/lhgdialog.min.js')}`);
            return { redirectUrl: chrome.extension.getURL('scripts/lhgdialog.min.js') };
        }

        return { redirectUrl: url };
    },
    { urls: ["*://10.3.255.30/*", "*://10.3.255.31/*", "*://10.3.255.32/*", "*://10.3.255.33/*"] },
    ["blocking"]
);
