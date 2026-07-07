import { z } from "zod"

const emailSchema = z.string().trim().email("Enter a valid email address.")
const passwordSchema = z.string().min(8, "Password must be at least 8 characters.")

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
})

export const signUpSchema = z
  .object({
    fullName: z.string().trim().min(2, "Full name is required."),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })

export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
