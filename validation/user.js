const z = require("zod");

const SignupRequestBodyValidation = z.object({
    username: z.string().email().min(5).max(50).toLowerCase().trim(),
    firstName: z.string().min(3).max(50).trim(),
    lastName: z.string().min(3).max(50).trim().optional(),
    password: z.string().min(6),
});
const SigninRequestBodyValidation = z.object({
    username: z.string().email().min(5).max(50).toLowerCase().trim(),
    password: z.string().min(6),
});

const UpdateRequestBodyValidation = z.object({
    firstName: z.string().min(3).max(50).trim().optional(),
    lastName: z.string().min(3).max(50).trim().optional().optional(),
    newPassword: z.string().min(6).optional(),
    oldPassword: z.string().min(6).optional(),
});

module.exports = {
    SignupRequestBodyValidation,
    SigninRequestBodyValidation,
    UpdateRequestBodyValidation
}