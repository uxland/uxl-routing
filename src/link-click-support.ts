const getSameOriginLinkHref = (event: MouseEvent) =>{
    if (event.button !== 0) {
        return null;
    }

    // We don't want modified clicks, where the intent is to open the page
    // in a new tab.
    if (event.metaKey || event.ctrlKey) {
        return null;
    }

    const eventPath = (<any>event).composedPath();
    let anchor = null;

    for (let i = 0; i < eventPath.length; i++) {
        const element = eventPath[i];

        if (element.tagName === 'A' && element.href) {
            anchor = element;
            break;
        }
    }

    // If there's no link there's nothing to do.
    if (!anchor) {
        return null;
    }

    // Target blank is a new tab, don't intercept.
    if (anchor.target === '_blank') {
        return null;
    }

    // If the link is for an existing parent frame, don't intercept.
    if ((anchor.target === '_top' || anchor.target === '_parent') &&
        window.top !== window) {
        return null;
    }

    // If the link is a download, don't intercept.
    if (anchor.download) {
        return null;
    }

    const href = anchor.href;

    // It only makes sense for us to intercept same-origin navigations.
    // pushState/replaceState don't work with cross-origin links.
    let url;

    if (document.baseURI != null) {
        url = new URL(href, /** @type {string} */ (document.baseURI));
    } else {
        url = new URL(href);
    }

    let origin;

    // IE Polyfill
    if (window.location.origin) {
        origin = window.location.origin;
    } else {
        origin = window.location.protocol + '//' + window.location.host;
    }

    let urlOrigin;

    if (url.origin) {
        urlOrigin = url.origin;
    } else {
        // IE always adds port number on HTTP and HTTPS on <a>.host but not on
        // window.location.host
        let urlHost = url.host;
        const urlPort = url.port;
        const urlProtocol = url.protocol;
        const isExtraneousHTTPS = urlProtocol === 'https:' && urlPort === '443';
        const isExtraneousHTTP = urlProtocol === 'http:' && urlPort === '80';

        if (isExtraneousHTTPS || isExtraneousHTTP) {
            urlHost = url.hostname;
        }
        urlOrigin = urlProtocol + '//' + urlHost;
    }

    if (urlOrigin !== origin) return null;

    let normalizedHref = url.pathname + url.search + url.hash;

    // pathname should start with '/', but may not if `new URL` is not supported
    if (normalizedHref[0] !== '/')
        normalizedHref = '/' + normalizedHref;

    // Need to use a full URL in case the containing page has a base URI.
    return new URL(normalizedHref, window.location.href).href;
}

export const initializeLinkClickSupport = (router: {navigate: any}) =>{
    document.body.addEventListener('click', (e: MouseEvent) =>{
        if(!e.defaultPrevented){
            const href = getSameOriginLinkHref(e);
            if(href){
                e.preventDefault();
                router.navigate(href);
            }
        }
    });
};
export default initializeLinkClickSupport;