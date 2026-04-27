import { useEffect } from "react";
import { usePostFormStore } from "../../store/usePostFormStore";
import { createPortal } from "react-dom";
import { createPostSchema } from "../../validations/post";
import type {
  CreatePostFormValues,
  UpdatePostFormValues,
} from "../../validations/post";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { useCategories, useTags, useRaces } from "../../hooks/lookup";
import { MultiSelect } from "../ui/MultiSelect";
import { cn } from "../../utils";
import { useCreatePost, useUpdatePost } from "../../hooks/posts";
import { useModalOverlay } from "../../hooks/ui/useModalOverlay";

export const CreatePostModal = () => {
  const { isCreatePostOpen, closeCreatePost, editingPost } = usePostFormStore();
  const isEditing = !!editingPost;

  const { data: categories = [], isLoading: isCategoriesLoading } =
    useCategories();
  const { data: races = [], isLoading: isRacesLoading } = useRaces();
  const { data: tags = [], isLoading: isTagsLoading } = useTags();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      content: "",
      category_id: undefined,
      visible_race_ids: [],
      tag_ids: [],
    },
  });

  const handleSuccess = () => {
    reset();
    closeCreatePost();
  };

  const createPostMutation = useCreatePost(handleSuccess);
  const updatePostMutation = useUpdatePost(handleSuccess);

  useModalOverlay(isCreatePostOpen, closeCreatePost);

  useEffect(() => {
    if (!isCreatePostOpen) return;

    if (isEditing) {
      reset({
        title: editingPost.title,
        content: editingPost.content,
        category_id: editingPost.category.id,
        tag_ids: editingPost.tags.map((t) => t.id),
        visible_race_ids:
          editingPost.visible_races.length === 0
            ? [0]
            : editingPost.visible_races.map((r) => r.id),
      });
    } else {
      reset({
        title: "",
        content: "",
        category_id: undefined,
        visible_race_ids: [],
        tag_ids: [],
      });
    }
  }, [isCreatePostOpen, editingPost]);

  if (!isCreatePostOpen) return null;

  const onSubmit = (data: CreatePostFormValues) => {
    if (isEditing) {
      updatePostMutation.mutate({
        postId: editingPost.id,
        data: data as UpdatePostFormValues,
      });
    } else {
      createPostMutation.mutate(data);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleSuccess}
      />

      <div className="relative w-full max-w-2xl bg-bg-surface border border-border-accent p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-y-auto max-h-[90vh] rounded-sm flex flex-col">
        <button
          onClick={handleSuccess}
          className="absolute top-4 right-4 text-text-dim hover:text-gold transition-colors uppercase text-[10px] tracking-[2px]"
        >
          [ Close ]
        </button>

        <h2 className="text-gold uppercase tracking-[2px] text-lg mb-6 border-b border-border-accent pb-2">
          {isEditing ? "Edit Chronicle Entry" : "New Chronicle Entry"}
        </h2>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Scroll title"
            placeholder="Enter a title..."
            containerClassName="mb-0"
            className="bg-bg-base border-border-accent text-text-mid rounded-sm p-3"
            error={errors.title?.message}
            {...register("title")}
          />

          <div className="flex flex-col gap-2">
            <label className="block text-[11px] uppercase tracking-[1.5px] text-text-mid">
              Content
            </label>
            <textarea
              {...register("content")}
              className={cn(
                "bg-bg-base border text-[14px] border-border-accent text-text-mid p-3 rounded-sm min-h-37.5 resize-y focus:border-gold focus:outline-none transition-colors",
                errors.content ? "border-red-500" : "",
              )}
              placeholder="Describe your tale..."
            />
            {errors.content && (
              <span className="text-red-500 text-[11px]">
                {errors.content.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Controller
              control={control}
              name="category_id"
              render={({ field }) => (
                <Select
                  label="Category"
                  placeholder="Select a category..."
                  containerClassName="mb-0"
                  value={field.value}
                  onChange={field.onChange}
                  options={categories.map((cat) => ({
                    id: cat.id,
                    name: cat.name,
                  }))}
                  error={errors.category_id?.message}
                  isLoading={isCategoriesLoading}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Controller
                control={control}
                name="visible_race_ids"
                render={({ field }) => {
                  const handleRaceChange = (newValues: number[]) => {
                    const currentValue = field.value || [];
                    const allSelected = newValues.includes(0);
                    const previouslyAllSelected = currentValue.includes(0);
                    const selectedSpecificRaces = newValues.filter(
                      (v) => v !== 0,
                    );

                    if (allSelected && !previouslyAllSelected) {
                      field.onChange([0]);
                    } else if (
                      races.length > 0 &&
                      selectedSpecificRaces.length === races.length
                    ) {
                      field.onChange([0]);
                    } else {
                      field.onChange(selectedSpecificRaces);
                    }
                  };

                  return (
                    <MultiSelect
                      label="Visible to Races"
                      values={field.value}
                      onChange={handleRaceChange}
                      options={[
                        { id: 0, name: "All races (public)" },
                        ...races.map((r) => ({ id: r.id, name: r.name })),
                      ]}
                      error={errors.visible_race_ids?.message}
                      isLoading={isRacesLoading}
                    />
                  );
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Controller
                control={control}
                name="tag_ids"
                render={({ field }) => (
                  <MultiSelect
                    label="Tags"
                    containerClassName="mb-0"
                    values={field.value}
                    onChange={field.onChange}
                    options={tags.map((tag) => ({
                      id: tag.id,
                      name: tag.name,
                    }))}
                    error={errors.tag_ids?.message}
                    isLoading={isTagsLoading}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex justify-end items-center gap-4 pt-4 mt-2 border-t border-border-accent">
            <button
              type="button"
              onClick={handleSuccess}
              className="text-text-dim hover:text-text-mid transition-colors uppercase text-[13px] tracking-[1.5px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                createPostMutation.isPending ||
                updatePostMutation.isPending
              }
              className="bg-bg-surface border border-gold text-gold hover:bg-bg-hover transition-colors px-6 py-2 uppercase tracking-[2px] text-[13px] rounded-sm disabled:opacity-50"
            >
              {isEditing ? "Save changes" : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};
