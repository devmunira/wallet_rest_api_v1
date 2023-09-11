// generate sortType
const generateSortType = (sortType) => {
    return sortType === 'desc' ? -1 : 1
}

// generate query string
const generateQueryString = (path , query) => {
    let q =  Object.keys(query).map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(query[key])).join('&');
    return `${path}?${q}`
}

// create selected item array for select specific items from db
const generateSelectItems = (array,defaultArray) => {
    let selectedArray = defaultArray;
    if(array.length > 0){
        selectedArray = array.split(',').map((item) => item.trim());
    }
    return selectedArray;
}


export {
    generateQueryString,
    generateSortType,
    generateSelectItems
}