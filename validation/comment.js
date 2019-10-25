const validator = require('validator')
const isEmpty = require('./is-empty')
module.exports = function validateCommentInput(data) {
    let errors = {}

    data.text = ! isEmpty(data.text) ? data.text : ''

    if (! validator.isLength(data.text, {
        min: 10,
        max: 300
    })) {
        errors.text = 'Comment should be between 10 and 300 characters'
    }


    if (validator.isEmpty(data.text)) {
        errors.text = "Text field is required"
    }


    return {errors: errors, isValid: isEmpty(errors)}
}
