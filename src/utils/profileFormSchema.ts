import { z } from "zod";

export const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, "A neved legalább 2 karakter hosszú kell legyen")
    .max(50, "A neved legfeljebb 50 karakter hosszú lehet")
    .optional()
    .or(z.literal("")),
  teamid: z.string().optional().or(z.literal("")), // = string | undefined | ""
  avatar: z.string().optional().or(z.literal("")),
  winteamid: z.string().optional().or(z.literal("")),
  A: z.string().optional().or(z.literal("")),
  B: z.string().optional().or(z.literal("")),
  C: z.string().optional().or(z.literal("")),
  D: z.string().optional().or(z.literal("")),
  E: z.string().optional().or(z.literal("")),
  F: z.string().optional().or(z.literal("")),
  G: z.string().optional().or(z.literal("")),
  H: z.string().optional().or(z.literal("")),
  I: z.string().optional().or(z.literal("")),
  J: z.string().optional().or(z.literal("")),
  K: z.string().optional().or(z.literal("")),
  L: z.string().optional().or(z.literal("")),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;
