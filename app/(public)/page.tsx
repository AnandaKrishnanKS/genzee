import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import MeetSection from "@/components/home/MeetSection";
import HowFeelingSection from "@/components/home/HowFeelingSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import PayWhatYouCanSection from "@/components/home/PayWhatYouCanSection";
import FAQPreviewSection from "@/components/home/FAQPreviewSection";
import FinalCTASection from "@/components/home/FinalCTASection";

export const metadata: Metadata = {
  title: "GenZee Psychologist — Online Psychological Consultations",
  description:
    "A welcoming space for honest conversations, personal growth, and psychological support — at your own pace. Book an online consultation today.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MeetSection />
      <HowFeelingSection />
      <HowItWorksSection />
      <PayWhatYouCanSection />
      <FAQPreviewSection />
      <FinalCTASection />
    </>
  );
}
