const yup = require('yup')

async function validateCreateProduct(ctx, next) {
    try {
        const postData = ctx.request.body

        const schema = yup.object({
            name: yup.string().required(),
            price: yup.number().typeError('price must be a number').positive().required(),
            description: yup.string().required(),
            product: yup.string().required(),
            color: yup.string().optional(),
            image:yup.string().url().optional()
        })
        .noUnknown(true)

        await schema.validate(postData, {
            strict: true,
            abortEarly: false
        })
        await next();

    } catch (error) {
        ctx.status = 400
        ctx.body = {
            success: false,
            error: error.errors
        }
    }
}

async function validateUpdateProduct(ctx, next) {
    try {
        const postData = ctx.request.body

        const schema = yup.object({
            name: yup.string().optional(),
            price: yup.number().typeError('price must be a number').positive().optional(),
            description: yup.string().optional(),
            product: yup.string().optional(),
            color: yup.string().optional(),
            image:yup.string().url().optional()
        })
        .noUnknown(true)

        await schema.validate(postData, {
            strict: true,
            abortEarly: false
        })
        await next();

    } catch (error) {
        ctx.status = 400
        ctx.body = {
            success: false,
            error: error.errors
        }
    }
}

module.exports = {
    validateCreateProduct,
    validateUpdateProduct
}
