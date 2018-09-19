let domain = '';
if (process.env.NODE_ENV === 'development') {
    domain = 'https://statdive.com';
}

function getUrl(url, fillers=null) {
    url = domain + url;
    if (fillers !== null) {
        for (let fill in fillers) {
            url = url.replace(`[=${fill}=]`, fillers[fill]);
        }
    }
    return url;
}

function getImage(url) {
    return domain + url;
}

export { getUrl, getImage }