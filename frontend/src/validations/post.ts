import z from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, `Title cannot be empty`)
    .max(255, `Title must be at most 255 characters`),
  content: z.string().min(1, `Post content cannot be empty`),
  category_id: z.number().min(1, `Please select a category`),
  visible_race_ids: z.array(z.number()),
  tag_ids: z.array(z.number()),
});

export type CreatePostFormValues = z.infer<typeof createPostSchema>;
