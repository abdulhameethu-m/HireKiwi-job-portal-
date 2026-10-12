import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string({ required_error: 'Full name is required.' })
    .transform(val => val.trim())
    .refine(val => val.length >= 2, { message: 'Enter at least 2 characters.' })
    .refine(val => val.length <= 80, { message: 'Name must be 80 characters or fewer.' }),
  email: z.string({ required_error: 'Email address is required.' })
    .transform(val => val.trim().toLowerCase())
    .refine(val => val.length > 0, { message: 'Email address is required.' })
    .refine(val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), { message: 'Enter a valid email address.' }),
  phone: z.string({ required_error: 'Phone number is required.' })
    .transform(val => val.trim())
    .refine(val => /^\d{10}$/.test(val), { message: 'Enter exactly 10 digits.' }),
  password: z.string({ required_error: 'Password is required.' })
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, { message: 'Password must contain at least one letter and one number.' }),
  confirmPassword: z.string({ required_error: 'Confirm password is required.' }),
  terms: z.boolean().refine(val => val === true, { message: 'You must agree to the terms and conditions.' })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword']
});

export const loginSchema = z.object({
  email: z.string({ required_error: 'Email address is required.' })
    .transform(val => val.trim().toLowerCase())
    .refine(val => val.length > 0, { message: 'Email address is required.' })
    .refine(val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), { message: 'Enter a valid email address.' }),
  password: z.string({ required_error: 'Password is required.' })
    .min(1, { message: 'Password is required.' })
});

export const applicationSchema = z.object({
  jobId: z.union([z.number(), z.string()]).transform(val => Number(val)),
  fullName: z.string({ required_error: 'Full name is required.' })
    .transform(val => val.trim())
    .refine(val => val.length >= 2, { message: 'Enter at least 2 characters.' })
    .refine(val => val.length <= 80, { message: 'Name must be 80 characters or fewer.' }),
  email: z.string({ required_error: 'Email address is required.' })
    .transform(val => val.trim().toLowerCase())
    .refine(val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), { message: 'Enter a valid email address.' }),
  phone: z.string({ required_error: 'Phone number is required.' })
    .transform(val => val.trim())
    .refine(val => /^\d{10}$/.test(val), { message: 'Enter exactly 10 digits.' }),
  experience: z.string({ required_error: 'Select your experience.' })
    .min(1, { message: 'Select your experience.' }),
  skills: z.string().optional().default(''),
  coverLetter: z.string().max(500, { message: 'Cover letter cannot exceed 500 characters.' }).optional().default(''),
  resumeFileName: z.string().optional()
});

export const jobSchema = z.object({
  title: z.string().trim().min(3, { message: 'Job title must be at least 3 characters.' }),
  company: z.string().trim().min(2, { message: 'Company name must be at least 2 characters.' }),
  location: z.string().trim().min(2, { message: 'Location is required.' }),
  experience: z.string().trim().min(1, { message: 'Experience requirement is required.' }),
  salary: z.string().trim().min(1, { message: 'Salary range is required.' }),
  type: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship', 'Hybrid'], {
    errorMap: () => ({ message: 'Select a valid employment type.' })
  }),
  category: z.string().trim().min(2, { message: 'Category is required.' }).default('Software Development'),
  description: z.string().trim().min(10, { message: 'Description must be at least 10 characters.' }),
  responsibilities: z.array(z.string()).optional().default([]),
  skills: z.array(z.string()).min(1, { message: 'Provide at least one required skill.' }),
  status: z.enum(['active', 'closed']).optional().default('active'),
  deadline: z.string().optional()
});

export const profileUpdateSchema = z.object({
  fullName: z.string().trim().min(2, { message: 'Full name must be at least 2 characters.' }).optional(),
  phone: z.string().trim().refine(val => /^\d{10}$/.test(val), { message: 'Enter exactly 10 digits.' }).optional(),
  headline: z.string().trim().max(100, { message: 'Headline must be 100 characters or fewer.' }).optional(),
  skills: z.union([z.array(z.string()), z.string()]).optional()
});
