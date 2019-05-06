export const extractGetParameters = (url: string) => String(url).split(/\?(.*)?$/).slice(1).join('') || undefined;
