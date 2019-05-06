import {clean} from "./clean";

export const root = (url: string, routes: {route: string}[] = []) =>{
    let matched = routes.map(r => r.route === '' || r.route === '*' ? url : url.split(new RegExp(r.route + '($|\/)'))[0]);
    return matched.length ? matched.reduce((prev, cur) => prev.length > cur.length ? cur : prev, url) : clean(url);
};

