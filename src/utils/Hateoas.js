// generate all types of hateoas links for any type of Model
import { generateQueryString } from "./Query.js"

// create hateoas links generator
const generateCreateHateoasLinks = (baseUrl,id,slug) => {
    return {
        self :    `${process.env.API_BASE_URL}${baseUrl}/${id}/${slug}`,
        allItems : `${process.env.API_BASE_URL}${baseUrl}`,
    }
}


// generate all data hateoasplinks
const generateAllDataHateoasLinks = (url,baseUrl,page,totalPage,q) => {
    let links =  {
        self : `${process.env.API_BASE_URL}${url}`,
    }
    // generate nextpage links if next page exits
    if(page < totalPage){
        let query = generateQueryString(`${process.env.API_BASE_URL}${baseUrl}` , {...q , page : page + 1});
        links.nextPage = query
    }
    // generate prevpage links if prev page exits
    if(page > 1){
        let query = generateQueryString(`${process.env.API_BASE_URL}${baseUrl}` , {...q , page : page - 1});
        links.prevPage = query
    }

    return links;
}

export {
    generateAllDataHateoasLinks,
    generateCreateHateoasLinks
}