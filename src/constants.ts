import {actionNameBuilder} from '@uxland/uxl-redux'
const prefix = 'uxl-routing';
export const routingActionNamesFactory = (action: string) => {
    const actionsBuilder = actionNameBuilder(prefix);
    return actionsBuilder(action);
};

export default routingActionNamesFactory;