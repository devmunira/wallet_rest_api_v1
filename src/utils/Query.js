// generate sortType
const generateSortType = (sortType) => {
    return sortType === 'desc' ? -1 : 1
}

// generate query string
const generateQueryString = (path , query) => {
    let q =  Object.keys(query).map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(query[key])).join('&');
    return `${path}?${q}`
}


export {
    generateQueryString,
    generateSortType,
}