import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.outreachRequest.deleteMany();
  await prisma.referralLink.deleteMany();
  await prisma.alumni.deleteMany();
  await prisma.recruiter.deleteMany();

  // ── Alumni (25 dummy profiles) ──────────────────────────────
  const alumni = [
    // McKinsey
    { name: "Priya Sharma", gradYear: 2021, school: "CC", currentFirm: "mckinsey", currentTitle: "Associate", office: "New York", practiceArea: "Strategy", linkedinUrl: "https://linkedin.com/in/priya-sharma-cu", source: "SELF_ENROLLED", verifiedByAlumni: true, publishedToDirectory: true, willingToChat: true, grcInvolvement: "Project Lead F20" },
    { name: "James Chen", gradYear: 2020, school: "SEAS", currentFirm: "mckinsey", currentTitle: "Senior Associate", office: "San Francisco", practiceArea: "Digital", linkedinUrl: "https://linkedin.com/in/james-chen-cu", source: "SELF_ENROLLED", verifiedByAlumni: true, publishedToDirectory: true, willingToChat: true, grcInvolvement: "VP of Strategy S19–S20" },
    { name: "Elena Rodriguez", gradYear: 2022, school: "CC", currentFirm: "mckinsey", currentTitle: "Business Analyst", office: "Chicago", practiceArea: "Operations", linkedinUrl: "https://linkedin.com/in/elena-rodriguez-cu", source: "LINKEDIN_SEED", verifiedByAlumni: false, publishedToDirectory: false },

    // BCG
    { name: "David Kim", gradYear: 2019, school: "SEAS", currentFirm: "bcg", currentTitle: "Consultant", office: "New York", practiceArea: "Technology", linkedinUrl: "https://linkedin.com/in/david-kim-cu", source: "SELF_ENROLLED", verifiedByAlumni: true, publishedToDirectory: true, willingToChat: true, grcInvolvement: "Member F18–S19" },
    { name: "Sarah Mitchell", gradYear: 2021, school: "CC", currentFirm: "bcg", currentTitle: "Associate", office: "Boston", practiceArea: "Healthcare", linkedinUrl: "https://linkedin.com/in/sarah-mitchell-cu", source: "SELF_ENROLLED", verifiedByAlumni: true, publishedToDirectory: true, willingToChat: false, grcInvolvement: "Project Lead S21" },
    { name: "Alex Thompson", gradYear: 2023, school: "GS", currentFirm: "bcg", currentTitle: "Associate", office: "Washington DC", practiceArea: "Public Sector", linkedinUrl: "https://linkedin.com/in/alex-thompson-cu", source: "LINKEDIN_SEED", verifiedByAlumni: false, publishedToDirectory: false },

    // Bain
    { name: "Maya Patel", gradYear: 2020, school: "CC", currentFirm: "bain", currentTitle: "Senior Associate Consultant", office: "New York", practiceArea: "Private Equity", linkedinUrl: "https://linkedin.com/in/maya-patel-cu", source: "SELF_ENROLLED", verifiedByAlumni: true, publishedToDirectory: true, willingToChat: true, grcInvolvement: "President S20" },
    { name: "Ryan O'Brien", gradYear: 2022, school: "SEAS", currentFirm: "bain", currentTitle: "Associate Consultant", office: "Chicago", practiceArea: "Performance Improvement", linkedinUrl: "https://linkedin.com/in/ryan-obrien-cu", source: "REFERRAL", verifiedByAlumni: true, publishedToDirectory: true, willingToChat: true },

    // Deloitte
    { name: "Fatima Al-Hassan", gradYear: 2021, school: "SIPA", currentFirm: "deloitte", currentTitle: "Consultant", office: "New York", practiceArea: "Strategy & Analytics", linkedinUrl: "https://linkedin.com/in/fatima-alhassan-cu", source: "SELF_ENROLLED", verifiedByAlumni: true, publishedToDirectory: true, willingToChat: true, grcInvolvement: "Member S20–S21" },
    { name: "Marcus Johnson", gradYear: 2019, school: "CC", currentFirm: "deloitte", currentTitle: "Senior Consultant", office: "Atlanta", practiceArea: "Human Capital", linkedinUrl: "https://linkedin.com/in/marcus-johnson-cu", source: "SELF_ENROLLED", verifiedByAlumni: true, publishedToDirectory: true, willingToChat: false },

    // EY-Parthenon
    { name: "Lily Wang", gradYear: 2022, school: "CC", currentFirm: "ey-parthenon", currentTitle: "Associate", office: "New York", practiceArea: "Education", linkedinUrl: "https://linkedin.com/in/lily-wang-cu", source: "SELF_ENROLLED", verifiedByAlumni: true, publishedToDirectory: true, willingToChat: true, grcInvolvement: "Analyst F21" },
    { name: "Omar Hussain", gradYear: 2023, school: "CBS", currentFirm: "ey-parthenon", currentTitle: "Associate", office: "Chicago", practiceArea: "Transaction Strategy", linkedinUrl: "https://linkedin.com/in/omar-hussain-cu", source: "LINKEDIN_SEED", verifiedByAlumni: false, publishedToDirectory: false },

    // Strategy& (PwC)
    { name: "Grace Lee", gradYear: 2020, school: "Barnard", currentFirm: "pwc-strategy", currentTitle: "Senior Associate", office: "New York", practiceArea: "Deals Strategy", linkedinUrl: "https://linkedin.com/in/grace-lee-cu", source: "SELF_ENROLLED", verifiedByAlumni: true, publishedToDirectory: true, willingToChat: true, grcInvolvement: "Project Lead S20" },

    // Oliver Wyman
    { name: "Nathan Brooks", gradYear: 2021, school: "CC", currentFirm: "oliver-wyman", currentTitle: "Consultant", office: "New York", practiceArea: "Financial Services", linkedinUrl: "https://linkedin.com/in/nathan-brooks-cu", source: "SELF_ENROLLED", verifiedByAlumni: true, publishedToDirectory: true, willingToChat: true },
    { name: "Aisha Diallo", gradYear: 2022, school: "SEAS", currentFirm: "oliver-wyman", currentTitle: "Analyst", office: "London", practiceArea: "Digital", linkedinUrl: "https://linkedin.com/in/aisha-diallo-cu", source: "REFERRAL", verifiedByAlumni: true, publishedToDirectory: true, willingToChat: true, grcInvolvement: "Member F21" },

    // Cornerstone Research
    { name: "Kevin Zhao", gradYear: 2023, school: "CC", currentFirm: "cornerstone", currentTitle: "Analyst", office: "New York", practiceArea: "Antitrust", linkedinUrl: "https://linkedin.com/in/kevin-zhao-cu", source: "SELF_ENROLLED", verifiedByAlumni: true, publishedToDirectory: true, willingToChat: true, grcInvolvement: "Member S23" },

    // L.E.K.
    { name: "Sophie Turner", gradYear: 2021, school: "CC", currentFirm: "lek", currentTitle: "Associate Consultant", office: "Boston", practiceArea: "Life Sciences", linkedinUrl: "https://linkedin.com/in/sophie-turner-cu", source: "SELF_ENROLLED", verifiedByAlumni: true, publishedToDirectory: true, willingToChat: false },

    // Kearney
    { name: "Carlos Mendez", gradYear: 2020, school: "SEAS", currentFirm: "kearney", currentTitle: "Associate", office: "Chicago", practiceArea: "Operations", linkedinUrl: "https://linkedin.com/in/carlos-mendez-cu", source: "SELF_ENROLLED", verifiedByAlumni: true, publishedToDirectory: true, willingToChat: true, grcInvolvement: "VP of Operations F19" },

    // Analysis Group
    { name: "Emma Larsson", gradYear: 2022, school: "GS", currentFirm: "analysis-group", currentTitle: "Analyst", office: "Boston", practiceArea: "Economics", linkedinUrl: "https://linkedin.com/in/emma-larsson-cu", source: "SELF_ENROLLED", verifiedByAlumni: true, publishedToDirectory: true, willingToChat: true },
    { name: "Daniel Park", gradYear: 2023, school: "CC", currentFirm: "analysis-group", currentTitle: "Analyst", office: "New York", practiceArea: "Finance", linkedinUrl: "https://linkedin.com/in/daniel-park-cu", source: "LINKEDIN_SEED", verifiedByAlumni: false, publishedToDirectory: false },

    // CRA
    { name: "Rachel Green", gradYear: 2021, school: "CC", currentFirm: "cra", currentTitle: "Associate", office: "New York", practiceArea: "Intellectual Property", linkedinUrl: "https://linkedin.com/in/rachel-green-cu", source: "SELF_ENROLLED", verifiedByAlumni: true, publishedToDirectory: true, willingToChat: true, grcInvolvement: "Member F20–S21" },
    { name: "Ahmed Hassan", gradYear: 2022, school: "SEAS", currentFirm: "cra", currentTitle: "Analyst", office: "Washington DC", practiceArea: "Antitrust", linkedinUrl: "https://linkedin.com/in/ahmed-hassan-cu", source: "REFERRAL", verifiedByAlumni: true, publishedToDirectory: true, willingToChat: true },

    // KPMG
    { name: "Jessica Liu", gradYear: 2020, school: "CBS", currentFirm: "kpmg", currentTitle: "Senior Associate", office: "New York", practiceArea: "Strategy", linkedinUrl: "https://linkedin.com/in/jessica-liu-cu", source: "SELF_ENROLLED", verifiedByAlumni: true, publishedToDirectory: true, willingToChat: true },

    // More unverified seeds
    { name: "Tom Wilson", gradYear: 2019, school: "CC", currentFirm: "mckinsey", currentTitle: "Engagement Manager", office: "Houston", practiceArea: "Energy", linkedinUrl: "https://linkedin.com/in/tom-wilson-cu", source: "LINKEDIN_SEED", verifiedByAlumni: false, publishedToDirectory: false },
    { name: "Nina Patel", gradYear: 2023, school: "Barnard", currentFirm: "bain", currentTitle: "Associate Consultant", office: "Boston", practiceArea: "Retail", linkedinUrl: "https://linkedin.com/in/nina-patel-cu", source: "LINKEDIN_SEED", verifiedByAlumni: false, publishedToDirectory: false },
  ];

  for (const a of alumni) {
    await prisma.alumni.create({ data: a });
  }
  console.log(`  Created ${alumni.length} alumni`);

  // ── Recruiters (10 dummy) ──────────────────────────────
  const recruiters = [
    {
      name: "Jennifer Walsh",
      firm: "mckinsey",
      title: "Campus Recruiting Manager",
      email: "jennifer.walsh@mckinsey.com",
      schedulingLink: "https://calendly.com/mckinsey-columbia",
      officeHours: JSON.stringify([
        { dayOfWeek: "Tuesday", startTime: "17:00", endTime: "18:30", location: "Uris Hall 301", notes: "Drop-in, no appointment needed" },
      ]),
      nextCampusVisit: new Date("2026-09-15"),
      campusVisitEvent: "McKinsey Fall Info Session",
      focusSchools: "CC,SEAS,CBS",
      source: "ADMIN_ADDED",
    },
    {
      name: "Michael Torres",
      firm: "bcg",
      title: "Senior Recruiter",
      email: "michael.torres@bcg.com",
      schedulingLink: "https://calendly.com/bcg-columbia",
      officeHours: JSON.stringify([
        { dayOfWeek: "Wednesday", startTime: "12:00", endTime: "13:30", location: "Lerner Hall 555", notes: "Lunch provided" },
      ]),
      nextCampusVisit: new Date("2026-09-22"),
      campusVisitEvent: "BCG Case Workshop",
      focusSchools: "CC,SEAS,Barnard",
      source: "ADMIN_ADDED",
    },
    {
      name: "Amanda Chen",
      firm: "bain",
      title: "Recruiting Coordinator",
      email: "amanda.chen@bain.com",
      schedulingLink: "https://calendly.com/bain-columbia",
      officeHours: JSON.stringify([
        { dayOfWeek: "Thursday", startTime: "16:00", endTime: "17:30", location: "IAB 413", notes: "Sign up required" },
      ]),
      nextCampusVisit: new Date("2026-10-01"),
      campusVisitEvent: "Bain Culture & Careers Night",
      focusSchools: "CC,SEAS,GS",
      source: "ADMIN_ADDED",
    },
    {
      name: "Robert Kim",
      firm: "deloitte",
      title: "University Relations Lead",
      email: "rkim@deloitte.com",
      officeHours: JSON.stringify([
        { dayOfWeek: "Monday", startTime: "14:00", endTime: "15:30", location: "Virtual (Zoom)", notes: "Email for link" },
      ]),
      nextCampusVisit: new Date("2026-09-29"),
      campusVisitEvent: "Deloitte Strategy Consulting Panel",
      focusSchools: "CC,SEAS,SIPA,CBS",
      source: "ADMIN_ADDED",
    },
    {
      name: "Laura Fernandez",
      firm: "ey-parthenon",
      title: "Campus Recruiter",
      email: "laura.fernandez@parthenon.ey.com",
      officeHours: JSON.stringify([
        { dayOfWeek: "Friday", startTime: "10:00", endTime: "11:30", location: "SIPA 1512", notes: "Walk-ins welcome" },
      ]),
      nextCampusVisit: new Date("2026-10-08"),
      campusVisitEvent: "EY-Parthenon Education Practice Talk",
      focusSchools: "CC,SIPA,Barnard",
      source: "ADMIN_ADDED",
    },
    {
      name: "David Nakamura",
      firm: "oliver-wyman",
      title: "Recruiting Associate",
      email: "david.nakamura@oliverwyman.com",
      schedulingLink: "https://calendly.com/ow-columbia",
      officeHours: JSON.stringify([]),
      nextCampusVisit: new Date("2026-10-15"),
      campusVisitEvent: "Oliver Wyman Financial Services Workshop",
      focusSchools: "CC,SEAS",
      source: "ADMIN_ADDED",
    },
    {
      name: "Samantha Price",
      firm: "cornerstone",
      title: "Recruiting Manager",
      email: "sprice@cornerstone.com",
      officeHours: JSON.stringify([
        { dayOfWeek: "Wednesday", startTime: "15:00", endTime: "16:00", location: "Hamilton 602", notes: "Econ majors preferred" },
      ]),
      focusSchools: "CC,GS",
      source: "ADMIN_ADDED",
    },
    {
      name: "Chris Anderson",
      firm: "lek",
      title: "Campus Lead",
      email: "canderson@lek.com",
      officeHours: JSON.stringify([]),
      nextCampusVisit: new Date("2026-11-01"),
      campusVisitEvent: "L.E.K. Life Sciences Case Competition",
      focusSchools: "CC,SEAS",
      source: "ADMIN_ADDED",
    },
    {
      name: "Priyanka Gupta",
      firm: "analysis-group",
      title: "University Recruiting",
      email: "pgupta@analysisgroup.com",
      officeHours: JSON.stringify([
        { dayOfWeek: "Tuesday", startTime: "11:00", endTime: "12:00", location: "Virtual (Zoom)", notes: "For econ/STEM students" },
      ]),
      focusSchools: "CC,SEAS,GS",
      source: "ADMIN_ADDED",
    },
    {
      name: "Brian McCarthy",
      firm: "cra",
      title: "Recruiter",
      email: "bmccarthy@crai.com",
      officeHours: JSON.stringify([]),
      nextCampusVisit: new Date("2026-10-20"),
      campusVisitEvent: "CRA Info Session",
      focusSchools: "CC,SEAS",
      source: "ADMIN_ADDED",
    },
  ];

  for (const r of recruiters) {
    await prisma.recruiter.create({ data: r });
  }
  console.log(`  Created ${recruiters.length} recruiters`);

  // ── Admin user for dev ──────────────────────────────
  await prisma.user.upsert({
    where: { email: "admin@columbia.edu" },
    update: {},
    create: {
      name: "GRC Admin",
      email: "admin@columbia.edu",
      role: "ADMIN",
    },
  });
  console.log("  Created admin user");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
