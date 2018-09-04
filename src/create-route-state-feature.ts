import {routingActionNamesFactory} from './constants';
import {Route} from "./reducer";
import {Action, createAction} from "@uxland/uxl-redux/create-action";
import createBasicReducer from "@uxland/uxl-redux/create-basic-reducer";
import {Reducer} from "redux";
export const createRouteStateFeature = (name, defValue?: Route) => {
    const setActionName = routingActionNamesFactory(`set-${name}`);
    return {
        reducer: createBasicReducer<any>(setActionName, {defValue: defValue}) as Reducer<Route, Action>,
        setActionCreator: createAction<Route>(setActionName)
    }
};
export default createRouteStateFeature;