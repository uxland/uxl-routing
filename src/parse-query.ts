export const parseQuery: <T = any>(query: string) => T = s =>
    JSON.parse('{"' + decodeURI(s).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')