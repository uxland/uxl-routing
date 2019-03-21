import extractGetParameters from "./helpers/extract-get-parameters";
import getOnlyUrl from "./helpers/get-only-url";
import findMatchingRoutes from "./helpers/find-matching-routes";
import isPushStateAvailable from "./helpers/is-push-state-available";
import clean from "./helpers/clean";
import {root} from "./helpers/root";
import {spec} from '@uxland/uxl-utilities/spec';
import difference from 'ramda/es/difference';
import {Dispatch} from "redux";
import {setRouteActionCreator} from "./route";
import Timeout = NodeJS.Timeout;
declare global {
    interface Window { __NAVIGO_WINDOW_LOCATION_MOCK__: string; }
}
export interface Handler<T = any> {
    canNavigateFrom?: (url: string, params?: T, query?: string) => boolean | Promise<boolean>;
    navigatedFrom?: (url: string, params?: T, query?: string) => boolean;
}
export interface RouteHandler {
    route: string;
    handler?: Handler;
}
const isHashChangeAPIAvailable = () => typeof window !== 'undefined' && 'onhashchange' in window;
const routeHandlerDefinedSpec = spec<RouteHandler>(r => r.handler !== null);
const canNavigateFromSpec = routeHandlerDefinedSpec.and(spec<RouteHandler>(r => r.handler.canNavigateFrom !== null));
const navigateFromSpec = routeHandlerDefinedSpec.and(spec<RouteHandler>(r => r.handler.navigatedFrom !== null));

function async(makeGenerator){
    let result = (...args: any[]) => {
        var generator = makeGenerator.apply(this, args);

        function handle(result){
            // result => { done: [Boolean], value: [Object] }
            if (result.done) return Promise.resolve(result.value);

            return Promise.resolve(result.value).then(function (res){
                return handle(generator.next(res));
            }, function (err){
                return handle(generator.throw(err));
            });
        }

        try {
            let p = handle(generator.next);
            p['generator'] = generator;
            return p;
        } catch (ex) {
            return Promise.reject(ex);
        }
    }
    return result;
}
const routesToDeactivate = (last: string, current: string, routes: RouteHandler[]): RouteHandler[] => {
    let lastRoutes = findMatchingRoutes(last, routes, true).map(m => m.route);
    let currentRoutes = findMatchingRoutes(current, routes, true).map(m => m.route);
    return difference(lastRoutes, currentRoutes);
}

function *navigate(last: string, current: string, routes: RouteHandler[], router: Router){
    yield;
    let result = last;
    let onlyUrl = getOnlyUrl(current);
    let matchingRoute = findMatchingRoutes(onlyUrl, routes)[0];
    if(matchingRoute){
        let query = extractGetParameters(current);
        let toDeactivate = routesToDeactivate(last, current, routes);
        let canNavigateResponses = yield Promise.all(toDeactivate.filter(canNavigateFromSpec).map(r => r.handler.canNavigateFrom(current, matchingRoute.params, query) ));
        if(canNavigateResponses.every(x => x)){
            result = current;
            try{
                router.resolving = true;
                router.updateLocation(current);
                router.updateRoute(current,matchingRoute.params || undefined, query);
                yield Promise.all(toDeactivate.filter(navigateFromSpec).map(r => r.handler.navigatedFrom(current, matchingRoute.params, query)));
            }
            finally {
                router.resolving = false;
            }
        }
    }
    return {success: result === current, url: result};
}

export class Router {
    private routes: RouteHandler[] = [];
    private locationChangeHandler: any;
    private usePushState: boolean;
    private listeningInterval: any;
    public lastUrlResolved: string = null;
    private root: string = null;
    public resolving = false;
    public routing = true;
    private generator: Generator;

    constructor(private dispatch?: Dispatch, root?: string, private useHash = false, private hash = '#'){
        this.usePushState =  isPushStateAvailable();
        this.locationChangeHandler = this.locationChange.bind(this);
        if (root) {
            this.root = useHash ? root.replace(/\/$/, '/' + this.hash) : root.replace(/\/$/, '');
        } else if (useHash) {
           // this.root = this.currentLocation().split(this.hash)[0].replace(/\/$/, '/' + this.hash);
            this.root = this.currentLocation().split(this.hash)[0].replace(/\/$/, '');
        }
        this.listen();
    }

    async navigate(route: string): Promise<boolean> {

        try{
            let url = this.getRouteUrl(route);
            if(url === this.lastUrlResolved)
                return false;
            this.routing = true;
            this.cancelPrevious();
            let task = async(navigate)(this.lastUrlResolved, url, this.routes, this);
            this.generator = task.generator;
            let result = await task;
            this.lastUrlResolved = result.url;
            return result.success;
        }catch (e) {
            return false;
        }
        finally {
            this.routing = false;
        }
    }
    private getRouteUrl(route: string){
        let url = (route || '').replace(this.getRoot(), '');
        if (this.useHash){
            url = url.replace(new RegExp('^\/' + this.hash), '');
            if(!url.startsWith('/'))
                url = '/' + url;
        }

        return url;

    };
    private cancelPrevious(){
        try {
            this.generator && this.generator.throw();
        }catch (e) {

        }
    }
    register(...routes: RouteHandler[]){
        this.routes.push(...routes);
        if(findMatchingRoutes(getOnlyUrl(this.getRouteUrl(window.location.href)), routes).length)
            this.navigate(window.location.href);
    }
    reset(){
        this.cancelPrevious();
        this.routes = [];
    }
    updateRoute(href: string, params: any, query: string){
        this.dispatch && this.dispatch(setRouteActionCreator({href, params, query}))
    }
    private getRoot(){
        if (this.root !== null) return this.root;
        this.root = root(this.currentLocation().split('?')[0], this.routes);
        return this.root;
    }
    private listen(){
        if (this.usePushState) {
            window.addEventListener('popstate', this.locationChangeHandler);
        } else if (isHashChangeAPIAvailable()) {
            window.addEventListener('hashchange', this.locationChangeHandler);
        } else {
            let cached = this.currentLocation(), current, check;

            check = () => {
                current = this.currentLocation();
                if (cached !== current) {
                    cached = current;
                    this.locationChange();
                }
                this.listeningInterval = setTimeout(check, 200);
            };
            check();
        }
    }

    private currentLocation(){
        if (typeof window !== 'undefined') {
            if (typeof window.__NAVIGO_WINDOW_LOCATION_MOCK__ !== 'undefined') {
                return window.__NAVIGO_WINDOW_LOCATION_MOCK__;
            }
            return clean(window.location.href);
        }
        return '';
    }

    private async locationChange(){
        if(!this.resolving){
            let result = await this.navigate(this.currentLocation());
            if(!result){
                this.resolving = true;
                this.updateLocation(this.lastUrlResolved, true);
                this.resolving = false;
            }
        }
    }
    updateLocation(location: string, replaceState = false){
        if(this.usePushState){
            let to = `${this.getRoot()}${this.useHash ? '/#' : '/'}${location}`
            to = to.replace(/([^:])(\/{2,})/g, '$1/');
            let method = replaceState ? 'replaceState' : 'pushState';
            history[method]({}, '', to);
        }
        else if(typeof window != 'undefined') {
            let path = location.replace(new RegExp('^' + this.hash), '');
            window.location.href = window.location.href
                    .replace(/#$/, '')
                    .replace(new RegExp(this.hash + '.*$'), '') + this.hash + path;
        }
    }

}