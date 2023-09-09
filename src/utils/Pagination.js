// generate pagination
const generatePagination = (totalPage,page,totalItems,limit) => {
    let pagination = {
        totalItems,
        currentPage : page,
        limit,
        totalPage
    }
    // generate next page number based on totalPage
    if(page < totalPage) pagination.nextPage = page + 1
    // generate next page number based on totalPage
    if(page > 1) pagination.prevPage = page - 1
    return pagination;
}

export {
    generatePagination
}