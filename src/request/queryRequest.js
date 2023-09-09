import {query} from "express-validator"


// Find All Query params check
const basicQueryParams = [
    query('page')
    .optional()
    .isInt()
    .withMessage('Page must be an integer')
    ,
    query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be an integer between 1 and 100'),
    query('search')
    .optional()
    .isString().notEmpty().withMessage('Search query must be a non-empty string'),
    query('sort_type')
    .optional()
    .trim()
    .custom(val => isSortType(val)),
    query('sort_by')
    .optional()
    .trim()
    .custom(val => isSortBy(val)),
];

export default {
    basicQueryParams
}