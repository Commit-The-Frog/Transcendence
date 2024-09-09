
export function parseUrl(url, routes) {
    const routeNames = Object.keys(routes);
    for (let route of routeNames) {
        const match = matchRoute(route, url);
        if (match) {
            return { route, params: match };
        }
    }
    return null;
}


export function matchRoute(route, url) {
    const routeParts = route.split('/').filter(Boolean);
    const urlParts = url.split('/').filter(Boolean);

    if (routeParts.length !== urlParts.length) {
        return null;
    }

    const params = {};

    for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(':')) {
            const paramName = routeParts[i].slice(1);
            params[paramName] = urlParts[i];
        } else if (routeParts[i] !== urlParts[i]) {
            return null;
        }
    }

    return params;
}