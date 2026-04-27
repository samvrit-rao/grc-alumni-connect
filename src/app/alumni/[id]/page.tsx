import { prisma } from "@/lib/prisma";
import { FIRMS } from "@/lib/firms";
import { notFound } from "next/navigation";
import { CoffeeChatSection } from "@/components/coffee-chat-section";
import Link from "next/link";

export default async function AlumniDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const alumni = await prisma.alumni.findUnique({ where: { id: params.id } });

  if (!alumni || !alumni.publishedToDirectory) {
    notFound();
  }

  const firm = FIRMS.find((f) => f.slug === alumni.currentFirm);

  return (
    <div className="mx-auto max-w-[1128px] px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Main content */}
        <div className="space-y-4">
          {/* Profile card */}
          <div className="bg-white rounded-lg border border-li-border overflow-hidden">
            {/* Banner */}
            <div className="h-[120px] bg-gradient-to-r from-[#004182] to-[#0A66C2]" />
            <div className="px-6 pb-5 -mt-10">
              <div className="h-[120px] w-[120px] rounded-full border-4 border-white bg-[#E8E8E8] flex items-center justify-center">
                <span className="text-3xl font-bold text-li-text-secondary">
                  {alumni.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <h1 className="text-2xl font-semibold text-li-text mt-3">{alumni.name}</h1>
              <p className="text-base text-li-text-secondary">
                {alumni.currentTitle || "Alumni"} at {firm?.name || alumni.currentFirm}
              </p>
              {alumni.office && (
                <p className="text-sm text-li-text-muted mt-0.5">{alumni.office}</p>
              )}

              <div className="flex items-center gap-2 mt-4">
                {alumni.linkedinUrl && (
                  <a
                    href={alumni.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 rounded-full bg-li-blue text-white text-sm font-semibold hover:bg-li-blue-hover transition-colors"
                  >
                    Connect
                  </a>
                )}
                <Link
                  href={`/messaging`}
                  className="px-4 py-1.5 rounded-full border border-li-blue text-li-blue text-sm font-semibold hover:bg-li-blue/5 transition-colors"
                >
                  Message
                </Link>
                {alumni.linkedinUrl && (
                  <a
                    href={alumni.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 rounded-full border border-li-text-secondary text-li-text-secondary text-sm font-semibold hover:bg-black/5 transition-colors"
                  >
                    View LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* About / AI Summary */}
          <div className="bg-white rounded-lg border border-li-border p-6">
            <div className="flex items-center gap-2 mb-3">
              <svg className="h-4 w-4 text-li-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h2 className="text-base font-semibold text-li-text">About</h2>
              <span className="text-[10px] bg-li-blue/10 text-li-blue px-1.5 py-0.5 rounded font-semibold">AI Generated</span>
            </div>
            <p className="text-sm text-li-text-secondary leading-relaxed">
              {alumni.name} is {alumni.currentTitle ? `a ${alumni.currentTitle}` : "working"} at {firm?.name || alumni.currentFirm}.
              {alumni.office ? ` Based in ${alumni.office}.` : ""}
              {alumni.practiceArea ? ` Specializes in ${alumni.practiceArea}.` : ""}
              {alumni.school && alumni.gradYear ? ` Graduated from Columbia ${alumni.school} in ${alumni.gradYear}.` : ""}
              {alumni.grcInvolvement ? ` GRC involvement: ${alumni.grcInvolvement}.` : ""}
              {" "}Reach out via the message generator below to request a coffee chat.
            </p>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-lg border border-li-border p-6">
            <h2 className="text-base font-semibold text-li-text mb-4">Experience</h2>
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded bg-[#F4F2EE] flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-li-text-secondary">
                  {(firm?.shortName || alumni.currentFirm).slice(0, 3).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="text-sm font-semibold text-li-text">{alumni.currentTitle || "Consultant"}</div>
                <div className="text-sm text-li-text-secondary">{firm?.name || alumni.currentFirm}</div>
                {alumni.office && <div className="text-xs text-li-text-muted mt-0.5">{alumni.office}</div>}
              </div>
            </div>
          </div>

          {/* Education */}
          {alumni.gradYear && (
            <div className="bg-white rounded-lg border border-li-border p-6">
              <h2 className="text-base font-semibold text-li-text mb-4">Education</h2>
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded bg-[#F4F2EE] flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-li-blue">CU</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-li-text">Columbia University</div>
                  <div className="text-sm text-li-text-secondary">{alumni.school}</div>
                  <div className="text-xs text-li-text-muted">Class of {alumni.gradYear}</div>
                </div>
              </div>
            </div>
          )}

          {/* Coffee Chat Generator */}
          <div className="bg-white rounded-lg border border-li-border p-6">
            <CoffeeChatSection
              alumniName={alumni.name}
              alumniTitle={alumni.currentTitle || ""}
              firmName={firm?.name || alumni.currentFirm}
              office={alumni.office || ""}
            />
          </div>
        </div>

        {/* Right sidebar */}
        <div className="hidden lg:block space-y-4">
          <div className="bg-white rounded-lg border border-li-border p-4">
            <h3 className="text-sm font-semibold text-li-text mb-1">Profile details</h3>
            <div className="space-y-2 mt-3">
              <div>
                <div className="text-xs text-li-text-muted">Firm</div>
                <div className="text-sm text-li-text">{firm?.name || alumni.currentFirm}</div>
              </div>
              {alumni.office && (
                <div>
                  <div className="text-xs text-li-text-muted">Location</div>
                  <div className="text-sm text-li-text">{alumni.office}</div>
                </div>
              )}
              {alumni.practiceArea && (
                <div>
                  <div className="text-xs text-li-text-muted">Practice Area</div>
                  <div className="text-sm text-li-text">{alumni.practiceArea}</div>
                </div>
              )}
              {firm && (
                <div>
                  <div className="text-xs text-li-text-muted">Firm Tier</div>
                  <div className="text-sm text-li-text">{firm.tier}</div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-li-border p-4">
            <Link href="/alumni" className="text-sm text-li-blue font-semibold hover:underline">
              ← Back to network
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
