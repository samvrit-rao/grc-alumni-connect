import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
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
      <Card className="hover:shadow-lg transition-all cursor-pointer h-full border-slate-200 hover:border-teal group">
        <CardContent className="p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-navy/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-semibold text-navy">
                {alumni.name.split(" ").map((n) => n[0]).join("")}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-navy group-hover:text-teal transition-colors">
                {alumni.name}
              </h3>
              <p className="text-xs text-[#595959]">{alumni.currentTitle}</p>
            </div>
          </div>

          <div className="space-y-2 ml-[52px]">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#9E9E9E] w-10 text-xs">Firm</span>
              <span className="text-navy font-medium">{firm?.shortName || alumni.currentFirm}</span>
            </div>
            {alumni.office && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[#9E9E9E] w-10 text-xs">Office</span>
                <span className="text-[#595959]">{alumni.office}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
