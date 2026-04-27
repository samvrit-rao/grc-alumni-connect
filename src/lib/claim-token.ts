import jwt from "jsonwebtoken";

const SECRET = process.env.CLAIM_TOKEN_SECRET || "dev-claim-secret";

interface ClaimPayload {
  alumniId: string;
  type: "claim";
}

export function generateClaimToken(alumniId: string): string {
  return jwt.sign({ alumniId, type: "claim" } satisfies ClaimPayload, SECRET, {
    expiresIn: "30d",
  });
}

export function verifyClaimToken(token: string): ClaimPayload | null {
  try {
    const payload = jwt.verify(token, SECRET) as ClaimPayload;
    if (payload.type !== "claim") return null;
    return payload;
  } catch {
    return null;
  }
}
