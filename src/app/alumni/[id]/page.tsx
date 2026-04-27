import { prisma } from "@/lib/prisma";
import { FIRMS } from "@/lib/firms";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RequestIntroButton } from "@/components/request-intro-button";
import { RemoveMeButton } from "@/components/remove-me-button";
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
    <div>
      {/* Header */}
      <div className="bg-navy">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/alumni" className="text-sm text-columbia-blue/70 hover:text-columbia-blue transition-colors">
            ← Back to directory
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-slate-200">
          <CardContent className="p-8">
            {/* Profile header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="h-14 w-14 rounded-full bg-navy/10 flex items-center justify-center shrink-0">
                <span className="text-lg font-semibold text-navy">
                  {alumni.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-xl font-display font-bold text-navy">{alumni.name}</h1>
                    <p className="text-slate-500 mt-0.5">
                      {alumni.currentTitle} at {firm?.name || alumni.currentFirm}
                    </p>
                  </div>
                  {alumni.willingToChat && (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                      Open to chat
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Firm</div>
                <div className="text-sm text-navy mt-1 font-medium">{firm?.name || alumni.currentFirm}</div>
              </div>
              {alumni.office && (
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Office</div>
                  <div className="text-sm text-navy mt-1">{alumni.office}</div>
                </div>
              )}
              {alumni.practiceArea && (
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Practice Area</div>
                  <div className="text-sm text-navy mt-1">{alumni.practiceArea}</div>
                </div>
              )}
              <div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Education</div>
                <div className="text-sm text-navy mt-1">Columbia {alumni.school} &apos;{alumni.gradYear?.toString().slice(-2)}</div>
              </div>
            </div>

            {alumni.grcInvolvement && (
              <>
                <Separator className="my-6" />
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">GRC Involvement</div>
                  <div className="text-sm text-navy mt-1">{alumni.grcInvolvement}</div>
                </div>
              </>
            )}

            {alumni.linkedinUrl && (
              <>
                <Separator className="my-6" />
                <a
                  href={alumni.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-columbia-dark hover:underline font-medium"
                >
                  View LinkedIn Profile →
                </a>
              </>
            )}

            <Separator className="my-6" />

            <div className="flex items-center justify-between">
              <RequestIntroButton alumniId={alumni.id} alumniName={alumni.name} />
              <RemoveMeButton alumniId={alumni.id} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
