export const getLastUrlSegment = () => {
        const segments = window.location.pathname.split('/');
        const lastSegment = segments.pop() || segments.pop();
    return lastSegment;
}