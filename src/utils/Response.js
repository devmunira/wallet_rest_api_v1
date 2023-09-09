// populate response data
const transformData = (items = [] , url = '') => {
    return items.length > 0 && items.map((item) => {
        delete item._doc.__v;
        return {
            ...item._doc,
            links : `${process.env.API_BASE_URL}${url}`,
        }
    })
}

export {
    transformData
}

