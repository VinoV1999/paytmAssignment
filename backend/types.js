const { z } = require('zod');

const signUpSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string()
})

const signInSchema = z.object({
    email: z.string(),
    password: z.string()
})

const updateSchema = z.object({
	password: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
})

module.exports = {
    signUpSchema, signInSchema, updateSchema
}