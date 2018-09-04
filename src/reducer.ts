import {routeReducer as  route} from './route'
import {combineReducers, Reducer} from "redux";
export interface Route<T = any>{
    href: string;
    params?: T;
    query?: string;
}

export interface RoutingState{
    route: Route;
}
export const reducer: Reducer = combineReducers<RoutingState>({route});
export default reducer;