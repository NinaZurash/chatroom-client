// import { useMutation } from "@tanstack/react-query";
// import { z } from "zod";

// const signInSchema = z.object({
//   email: z.string().email(),
//   password: z
//     .string()
//     .min(6, { message: "Password must be at least 6 characters long" }),
// });

// type SignInData = z.infer<typeof signInSchema>;

// async function signIn(data: SignInData) {
//   const response = await fetch("/api/auth/signin", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   if (!response.ok) {
//     throw new Error("Sign-in failed");
//   }

//   const result = await response.json();
//   return result;
// }

// export function useSignIn() {
//   return useMutation(signIn);
// }
