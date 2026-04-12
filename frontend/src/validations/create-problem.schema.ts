import { z } from "zod";

export const createProblemSchema = z.object({
  title: z.string().nonempty("Title can't be blank").max(32),
  author: z.string().nonempty("Author can't be blank").max(32),
  points: z.coerce.number().positive("Points have to be bigger than 0"),
  difficulty: z.enum(
    ["easy", "medium", "hard"],
    "Difficulty has to be one of each: Easy, Medium or Hard",
  ),
  description: z.string().nonempty("Description can't be blank").max(1024),
  inputDescription: z
    .string()
    .nonempty("Input description can't be blank")
    .max(512),
  outputDescription: z
    .string()
    .nonempty("Output description can't be blank")
    .max(512),
  inputExample: z.string().nonempty("Input example can't be blank").max(512),
  outputExample: z.string().nonempty("Output example can't be blank").max(512),
});
