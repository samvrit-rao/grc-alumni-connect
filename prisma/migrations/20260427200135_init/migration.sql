-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Alumni" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "gradYear" INTEGER,
    "school" TEXT,
    "currentFirm" TEXT NOT NULL,
    "currentTitle" TEXT,
    "office" TEXT,
    "practiceArea" TEXT,
    "linkedinUrl" TEXT NOT NULL,
    "workEmail" TEXT,
    "personalEmail" TEXT,
    "willingToChat" BOOLEAN NOT NULL DEFAULT false,
    "grcInvolvement" TEXT,
    "source" TEXT NOT NULL,
    "verifiedByAlumni" BOOLEAN NOT NULL DEFAULT false,
    "publishedToDirectory" BOOLEAN NOT NULL DEFAULT false,
    "claimToken" TEXT,
    "claimTokenExpiresAt" DATETIME,
    "claimedAt" DATETIME,
    "referredBy" TEXT,
    "lastEnrichedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Recruiter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "firm" TEXT NOT NULL,
    "title" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "schedulingLink" TEXT,
    "officeHours" TEXT,
    "nextCampusVisit" DATETIME,
    "campusVisitEvent" TEXT,
    "focusSchools" TEXT,
    "source" TEXT,
    "lastEnrichedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "OutreachRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "requesterId" TEXT NOT NULL,
    "alumniId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFTED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "OutreachRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OutreachRequest_alumniId_fkey" FOREIGN KEY ("alumniId") REFERENCES "Alumni" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReferralLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Alumni_linkedinUrl_key" ON "Alumni"("linkedinUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Alumni_claimToken_key" ON "Alumni"("claimToken");

-- CreateIndex
CREATE INDEX "Alumni_currentFirm_idx" ON "Alumni"("currentFirm");

-- CreateIndex
CREATE INDEX "Alumni_gradYear_idx" ON "Alumni"("gradYear");

-- CreateIndex
CREATE INDEX "Alumni_office_idx" ON "Alumni"("office");

-- CreateIndex
CREATE INDEX "Alumni_source_idx" ON "Alumni"("source");

-- CreateIndex
CREATE INDEX "Recruiter_firm_idx" ON "Recruiter"("firm");

-- CreateIndex
CREATE INDEX "OutreachRequest_requesterId_idx" ON "OutreachRequest"("requesterId");

-- CreateIndex
CREATE INDEX "OutreachRequest_alumniId_idx" ON "OutreachRequest"("alumniId");

-- CreateIndex
CREATE INDEX "OutreachRequest_status_idx" ON "OutreachRequest"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralLink_code_key" ON "ReferralLink"("code");
