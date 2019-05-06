export const isPushStateAvailable = () =>{
    return !!(
        typeof window !== 'undefined' &&
        window.history &&
        window.history.pushState
    );
};
