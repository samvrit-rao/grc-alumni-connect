import { OnboardingForm } from "@/components/onboarding-form";

interface Props {
  searchParams: { ref?: string };
}

export default function OnboardingPage({ searchParams }: Props) {
  return (
    <div>
      <div className="bg-navy">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-center">
          <h1 className="font-display text-3xl font-bold text-white">Join the Directory</h1>
          <p className="text-columbia-blue/80 mt-2">Help current GRC members navigate their consulting journey</p>
        </div>
      </div>
      <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8 py-8 -mt-4">
        <OnboardingForm referralCode={searchParams.ref} />
      </div>
    </div>
  );
}
