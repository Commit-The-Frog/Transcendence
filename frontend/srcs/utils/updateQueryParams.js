function updateQueryParam(queryKey, queryValue) {
    const url = new URL(window.location);
    const params = new URLSearchParams(url.search);

    params.set(queryKey, queryValue);

    url.search = params.toString();
    window.history.pushState(null, '', url);
}

export default updateQueryParam;