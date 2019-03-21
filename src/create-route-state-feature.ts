import {routingActionNamesFactory} from './constants';
import {Route} from "./reducer";
import {Action, createAction, createBasicReducer} from "@uxland/uxl-redux";
import {Reducer} from "redux";
export const createRouteStateFeature = (name, defValue?: Route) => {
    const setActionName = routingActionNamesFactory(`set-${name}`);
    return {
        reducer: createBasicReducer<any>(setActionName, {defValue: defValue}) as Reducer<Route, Action>,
        setActionCreator: createAction<Route>(setActionName)
    }
};
export default createRouteStateFeature;