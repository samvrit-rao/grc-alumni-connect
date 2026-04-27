import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FIRMS } from "@/lib/firms";

interface Alumni {
  id: string;
  name: string;
  gradYear: number | null;
  school: string | null;
  currentFirm: string;
  currentTitle: string | null;
  office: string | null;
  practiceArea: string | null;
  willingToChat: boolean;
  grcInvolvement: string | null;
}

export function AlumniCard({ alumni }: { alumni: Alumni }) {
  const firm = FIRMS.find((f) => f.slug === alumni.currentFirm);

  return (
    <Link href={`/alumni/${alumni.id}`}>
      <Card className="hover:shadow-lg transition-all cursor-pointer h-full border-slate-200 hover:border-columbia-blue group">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-navy/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-navy">
                  {alumni.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-navy group-hover:text-columbia-dark transition-colors">
                  {alumni.name}
                </h3>
                <p className="text-xs text-slate-500">{alumni.currentTitle}</p>
              </div>
            </div>
            {alumni.willingToChat && (
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[10px] border-0 shrink-0">
                Open to chat
              </Badge>
            )}
          </div>

          <div className="space-y-2 ml-[52px]">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-400 w-10 text-xs">Firm</span>
              <span className="text-navy font-medium">{firm?.shortName || alumni.currentFirm}</span>
            </div>
            {alumni.office && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400 w-10 text-xs">Office</span>
                <span className="text-slate-700">{alumni.office}</span>
              </div>
            )}
            {alumni.practiceArea && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400 w-10 text-xs">Area</span>
                <span className="text-slate-700">{alumni.practiceArea}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-400 w-10 text-xs">Grad</span>
              <span className="text-slate-700">{alumni.school} &apos;{alumni.gradYear?.toString().slice(-2)}</span>
            </div>
          </div>

          {alumni.grcInvolvement && (
            <div className="mt-4 pt-3 border-t border-slate-100 ml-[52px]">
              <span className="text-[11px] text-columbia-dark font-medium">
                GRC: {alumni.grcInvolvement}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
