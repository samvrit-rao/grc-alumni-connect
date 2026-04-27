"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function RemoveMeButton({ alumniId }: { alumniId: string }) {
  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove this profile from the directory? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/alumni/${alumniId}/remove`, { method: "POST" });
      if (!res.ok) throw new Error("Failed");
      toast.success("Profile removed from directory.");
      window.location.href = "/alumni";
    } catch {
      toast.error("Failed to remove profile.");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-xs text-slate-400 hover:text-red-600"
      onClick={handleRemove}
    >
      Remove me from directory
    </Button>
  );
}
