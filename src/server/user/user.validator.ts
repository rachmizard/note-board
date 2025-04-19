import { z } from "zod";

export const createUserValidator = z.object({
  id: z.string().min(1).describe("The user's ID"),
  username: z.string().describe("The user's username"),
  email: z.string().min(1).describe("The user's email"),
  firstName: z.string().describe("The user's first name"),
  lastName: z.string().describe("The user's last name"),
  profilePicture: z.string().describe("The user's profile picture"),
  gender: z.string().describe("The user's gender"),
});

export const createUserSessionProviderValidator = z.object({
  providers: z.array(
    z.object({
      id: z.string().min(1).describe("The external account ID"),
      userId: z.string().min(1).describe("The user's ID"),
      provider: z.string().min(1).describe("The provider"),
      providerId: z.string().min(1).describe("The provider ID"),
    })
  ),
});

export type CreateUserValidator = z.infer<typeof createUserValidator>;

export type CreateUserSessionProviderValidator = z.infer<
  typeof createUserSessionProviderValidator
>;
