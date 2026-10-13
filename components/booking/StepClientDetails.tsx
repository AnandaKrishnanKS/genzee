"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { ClientDetailsSchema, type ClientDetailsInput } from "@/lib/validations";
import { COUNTRIES, TIMEZONES } from "@/lib/constants";

interface StepClientDetailsProps {
  initialValues?: ClientDetailsInput;
  onNext: (details: ClientDetailsInput) => void;
  onBack: () => void;
}

export default function StepClientDetails({
  initialValues,
  onNext,
  onBack,
}: StepClientDetailsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientDetailsInput>({
    resolver: zodResolver(ClientDetailsSchema),
    defaultValues: initialValues ?? {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      ageConfirmed: false,
    },
  });

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-[#6D4EC9] text-sm font-medium mb-5 hover:text-[#A78BFA] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Change time
      </button>

      <h2 className="font-display text-2xl font-bold text-[#24212E] mb-1">
        Your details
      </h2>
      <p className="text-[#24212E]/55 text-sm mb-7">
        Your information is kept secure and private.
      </p>

      <form onSubmit={handleSubmit(onNext)} className="space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-[#24212E] mb-1.5">
            Full name <span aria-hidden className="text-[#A78BFA]">*</span>
          </label>
          <input
            id="name"
            {...register("name")}
            placeholder="Your full name"
            className="w-full px-4 py-3 rounded-xl border-2 border-[#F0E9FF] bg-white text-[#24212E] placeholder:text-[#24212E]/30 focus:outline-none focus:border-[#A78BFA] transition-colors"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1" role="alert">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-[#24212E] mb-1.5">
            Email address <span aria-hidden className="text-[#A78BFA]">*</span>
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border-2 border-[#F0E9FF] bg-white text-[#24212E] placeholder:text-[#24212E]/30 focus:outline-none focus:border-[#A78BFA] transition-colors"
          />
          <p className="text-[#24212E]/40 text-xs mt-1">
            Your confirmation email and reminder will be sent here.
          </p>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1" role="alert">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-[#24212E] mb-1.5">
            Phone number <span className="text-[#24212E]/40 font-normal">(optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            {...register("phone")}
            placeholder="+91 98765 43210"
            className="w-full px-4 py-3 rounded-xl border-2 border-[#F0E9FF] bg-white text-[#24212E] placeholder:text-[#24212E]/30 focus:outline-none focus:border-[#A78BFA] transition-colors"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1" role="alert">{errors.phone.message}</p>
          )}
        </div>

        {/* Country */}
        <div>
          <label htmlFor="country" className="block text-sm font-semibold text-[#24212E] mb-1.5">
            Country <span aria-hidden className="text-[#A78BFA]">*</span>
          </label>
          <select
            id="country"
            {...register("country")}
            className="w-full px-4 py-3 rounded-xl border-2 border-[#F0E9FF] bg-white text-[#24212E] focus:outline-none focus:border-[#A78BFA] transition-colors"
          >
            <option value="">Select your country</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
          {errors.country && (
            <p className="text-red-500 text-xs mt-1" role="alert">{errors.country.message}</p>
          )}
        </div>

        {/* Timezone */}
        <div>
          <label htmlFor="timezone" className="block text-sm font-semibold text-[#24212E] mb-1.5">
            Timezone <span aria-hidden className="text-[#A78BFA]">*</span>
          </label>
          <select
            id="timezone"
            {...register("timezone")}
            className="w-full px-4 py-3 rounded-xl border-2 border-[#F0E9FF] bg-white text-[#24212E] focus:outline-none focus:border-[#A78BFA] transition-colors"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>{tz.label}</option>
            ))}
          </select>
          {errors.timezone && (
            <p className="text-red-500 text-xs mt-1" role="alert">{errors.timezone.message}</p>
          )}
        </div>

        {/* Age confirmation */}
        <div className="flex items-start gap-3 p-4 bg-[#F0E9FF]/50 rounded-xl">
          <input
            id="ageConfirmed"
            type="checkbox"
            {...register("ageConfirmed")}
            className="mt-0.5 w-4 h-4 rounded accent-[#A78BFA]"
          />
          <label htmlFor="ageConfirmed" className="text-sm text-[#24212E]/70 leading-relaxed">
            I confirm that I am 18 years of age or older. This service is for adults only.
          </label>
        </div>
        {errors.ageConfirmed && (
          <p className="text-red-500 text-xs" role="alert">{errors.ageConfirmed.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#A78BFA] hover:bg-[#6D4EC9] text-white font-bold py-4 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(167,139,250,0.35)] disabled:opacity-70"
        >
          Continue →
        </button>
      </form>
    </div>
  );
}
