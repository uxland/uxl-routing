const ABSOLUTE_URL_REGEX = /^([a-z][a-z0-9+\-.]*:)?\/\//i;
export const isAbsoluteUrl = (url: string) => ABSOLUTE_URL_REGEX.test(url);
