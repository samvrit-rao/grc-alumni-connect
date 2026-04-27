"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  alumniId: string;
  alumniName: string;
}

export function AdminActions({ alumniId, alumniName }: Props) {
  const router = useRouter();

  const sendClaimInvite = async () => {
    try {
      const res = await fetch(`/api/admin/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alumniId }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      // Copy claim link to clipboard
      await navigator.clipboard.writeText(data.claimUrl);
      toast.success(`Claim link for ${alumniName} copied to clipboard!`);
    } catch {
      toast.error("Failed to generate claim invite.");
    }
  };

  const deleteAlumni = async () => {
    if (!confirm(`Delete ${alumniName} from the database?`)) return;
    try {
      const res = await fetch(`/api/admin/alumni/${alumniId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      toast.success(`${alumniName} removed.`);
      router.refresh();
    } catch {
      toast.error("Failed to delete.");
    }
  };

  return (
    <div className="flex gap-1">
      <Button size="sm" variant="outline" className="text-xs" onClick={sendClaimInvite}>
        Generate Claim Link
      </Button>
      <Button size="sm" variant="ghost" className="text-xs text-red-500" onClick={deleteAlumni}>
        Delete
      </Button>
    </div>
  );
}
