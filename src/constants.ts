import {actionNameBuilder} from '@uxland/uxl-redux/action-name-builder'
const prefix = 'uxl-routing';
export const routingActionNamesFactory = (action: string) => {
    const actionsBuilder = actionNameBuilder(prefix);
    return actionsBuilder(action);
};
export default routingActionNamesFactory;