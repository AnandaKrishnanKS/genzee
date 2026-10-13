"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Info } from "lucide-react";
import { IntakeDescriptionSchema, type IntakeDescriptionInput } from "@/lib/validations";
import { countWords, cn } from "@/lib/utils";
import { MAX_DESCRIPTION_WORDS } from "@/lib/constants";

interface StepDescriptionProps {
  initialValue?: string;
  onNext: (description: string) => void;
  onBack: () => void;
}

export default function StepDescription({
  initialValue,
  onNext,
  onBack,
}: StepDescriptionProps) {
  const [wordCount, setWordCount] = useState(
    initialValue ? countWords(initialValue) : 0
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IntakeDescriptionInput>({
    resolver: zodResolver(IntakeDescriptionSchema),
    defaultValues: { description: initialValue ?? "" },
  });

  const description = watch("description") ?? "";

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWordCount(countWords(e.target.value));
  };

  const onSubmit = (data: IntakeDescriptionInput) => {
    onNext(data.description ?? "");
  };

  const wordsRemaining = MAX_DESCRIPTION_WORDS - wordCount;
  const isOver = wordCount > MAX_DESCRIPTION_WORDS;

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-[#6D4EC9] text-sm font-medium mb-5 hover:text-[#A78BFA] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      <h2 className="font-display text-2xl font-bold text-[#24212E] mb-2">
        What&apos;s been on your mind lately?
      </h2>
      <p className="text-[#24212E]/55 text-sm mb-2">
        No pressure to find the perfect words. You can share a little about what brings
        you here — or skip this entirely.
      </p>

      {/* Privacy note */}
      <div className="flex items-start gap-2 bg-[#B8E9D1]/40 text-[#24212E]/70 text-xs p-3 rounded-xl mb-6">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#34D399]" />
        This is private and secure. Only your psychologist can see what you write here.
        It will never appear in emails or be shared with anyone else.
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="description" className="sr-only">
            Tell us what&apos;s been on your mind (optional, max 300 words)
          </label>
          <textarea
            id="description"
            {...register("description", {
              onChange: handleChange,
            })}
            rows={7}
            placeholder="You can share as little or as much as you like…"
            className={cn(
              "w-full px-4 py-3.5 rounded-xl border-2 bg-white text-[#24212E] placeholder:text-[#24212E]/30 focus:outline-none resize-none transition-colors leading-relaxed",
              isOver
                ? "border-red-400 focus:border-red-500"
                : "border-[#F0E9FF] focus:border-[#A78BFA]"
            )}
            aria-describedby="word-count"
          />

          {/* Word counter */}
          <div
            id="word-count"
            className={cn(
              "flex justify-between items-center mt-1.5 text-xs",
              isOver ? "text-red-500" : "text-[#24212E]/40"
            )}
            aria-live="polite"
            aria-atomic="true"
          >
            <span>
              {isOver
                ? `${Math.abs(wordsRemaining)} words over limit`
                : description.trim() === ""
                ? "Optional"
                : `${wordsRemaining} words remaining`}
            </span>
            <span className={isOver ? "font-bold" : ""}>
              {wordCount} / {MAX_DESCRIPTION_WORDS}
            </span>
          </div>

          {errors.description && (
            <p className="text-red-500 text-xs mt-1" role="alert">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => onNext("")}
            className="flex-1 py-3.5 rounded-xl border-2 border-[#F0E9FF] text-[#24212E]/60 font-semibold text-sm hover:border-[#A78BFA]/30 hover:bg-[#F0E9FF]/30 transition-all"
          >
            Skip for now
          </button>
          <button
            type="submit"
            disabled={isOver}
            className="flex-1 bg-[#A78BFA] hover:bg-[#6D4EC9] text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(167,139,250,0.35)] disabled:opacity-50"
          >
            Continue →
          </button>
        </div>
      </form>
    </div>
  );
}
