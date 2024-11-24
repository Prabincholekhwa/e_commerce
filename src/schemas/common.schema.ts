import z from 'zod';

export const passwordSchema = (
  name: string,
  min: number = 8,
  max: number = 32
) =>
  z
    .string({
      required_error: `${name} is required`,
      invalid_type_error: `${name} type is invalid`,
    })
    .min(min, { message: `${name} is too short` })
    .max(max, { message: `${name} is too long` })
    .refine(
      (password) => {
        if (!/[a-z]/.test(password)) return false;
        if (!/[A-Z]/.test(password)) return false;
        if (!/\d/.test(password)) return false;
        if (!/[!@#$%^&*()-_=+{};:'",<.>\/?[\]\\]/.test(password)) return false;
        return true;
      },
      {
        message:
          'Invalid password format(Must have at least 8 Chareater, A Capital Letter , A special chareter(symbol, sign) & A number )',
      }
    );

export const ISODateTimeString = (name: string) =>
  z
    .string()
    .refine(
      (value) =>
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/.test(
          value
        ),
      {
        message: `${name} must be a valid ISO date-time string.`,
      }
    );

export const emailField = (val: string) =>
  z
    .string({
      required_error: `${val} is required`,
      invalid_type_error: 'Provide valid type',
    })
    .min(1, { message: `${val} is too short` })
    .email('Invalid email address');

export const stringField = (val: string, min: number = 1, max?: number) =>
  z
    .string({
      required_error: `${val} is required`,
      invalid_type_error: 'Provide valid type',
    })
    .min(min, { message: `${val} is too short` })
    .refine((data) => (max ? data.length <= max : true), `${val} is too long`);

export const positiveNumberField = (val: string, min?: number, max?: number) =>
  z
    .number({
      required_error: `${val} is required`,
      invalid_type_error: 'Provide valid type',
    })
    .positive({ message: `${val} must be a positive number` })
    .refine((data) => (min !== undefined ? data >= min : true), {
      message: `${val} must be greater than or equal to ${min}`,
    })
    .refine((data) => (max !== undefined ? data <= max : true), {
      message: `${val} must be less than or equal to ${max}`,
    });

export const Id = z.object({
  id: stringField('ID'),
});

export type Id = z.infer<typeof Id>;
