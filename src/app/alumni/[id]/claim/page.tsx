import { prisma } from "@/lib/prisma";
import { verifyClaimToken } from "@/lib/claim-token";
import { notFound } from "next/navigation";
import { ClaimForm } from "@/components/claim-form";

interface Props {
  params: { id: string };
  searchParams: { token?: string };
}

export default async function ClaimPage({ params, searchParams }: Props) {
  const { token } = searchParams;

  if (!token) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <h1 className="text-xl font-bold text-slate-900">Invalid Link</h1>
        <p className="text-slate-500 mt-2">This claim link is missing a token.</p>
      </div>
    );
  }

  const payload = verifyClaimToken(token);
  if (!payload || payload.alumniId !== params.id) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <h1 className="text-xl font-bold text-slate-900">Expired or Invalid Link</h1>
        <p className="text-slate-500 mt-2">
          This claim link has expired or is invalid. Please contact GRC for a new one.
        </p>
      </div>
    );
  }

  const alumni = await prisma.alumni.findUnique({ where: { id: params.id } });
  if (!alumni) return notFound();

  if (alumni.verifiedByAlumni) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <h1 className="text-xl font-bold text-green-700">Already Verified</h1>
        <p className="text-slate-500 mt-2">
          Your profile has already been verified and published to the directory.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <ClaimForm alumni={alumni} token={token} />
    </div>
  );
}
