import {isPushStateAvailable} from "./is-push-state-available";

export const getOnlyUrl = (url: string, useHash: boolean = false, hash: string = '#') =>{
    let onlyURL = url, split;
    let cleanGETParam = str => str.split(/\?(.*)?$/)[0];

    if (typeof hash === 'undefined') {
        // To preserve BC
        hash = '#';
    }

    if (isPushStateAvailable() && !useHash) {
        onlyURL = cleanGETParam(url).split(hash)[0];
    } else {
        split = url.split(hash);
        onlyURL = split.length > 1 ? cleanGETParam(split[1]) : cleanGETParam(split[0]);
    }

    return onlyURL;
};
