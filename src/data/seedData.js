import { uid } from '../utils';
import { CATEGORIES, REGIONS, EXPERTISE_POOL } from '../constants';

/**
 * Generate a list of 20 seed consultant records.
 * @returns {Array} Array of consultant objects.
 */
export function seedConsultants() {
  const names = [
    "Anjali Rao", "Wei Chen", "Fatima Al-Sayed", "Carlos Mendez", "Priya Nair",
    "James O'Connor", "Ingrid Berg", "Kenji Watanabe", "Lerato Dlamini", "Mei Lin Tan",
    "Ahmed Farouk", "Sofia Rossi", "Daniel Kim", "Grace Owusu", "Marcus Weber",
    "Ravi Shankar", "Elena Petrova", "Tomasz Nowak", "Aisha Khan", "Paulo Silva"
  ];

  return names.map((name, i) => {
    const region = REGIONS[i % REGIONS.length];
    const cats = [CATEGORIES[i % 3]];
    if (i % 4 === 0) cats.push(CATEGORIES[(i + 1) % 3]);
    const exp = [];
    for (let k = 0; k < 3; k++) exp.push(EXPERTISE_POOL[(i * 3 + k) % EXPERTISE_POOL.length]);

    return {
      id: uid("CN"),
      code: `RA-${region.key}-${String(100 + i)}`,
      name,
      email: `${name.split(" ")[0].toLowerCase()}${i}@privatecontact.example`,
      phone: `+${10 + i} 55${i}0-${1000 + i * 7}`,
      region: region.key,
      country: region.countries[i % region.countries.length],
      categories: cats,
      expertise: exp,
      yearsExp: 6 + (i % 15),
      hourlyRate: 60 + (i % 10) * 15,
      rating: 3.5 + ((i % 5) * 0.3),
      ratingsLog: [
        {
          id: uid("RT"),
          score: 4 + (i % 2),
          note: "Delivered on time, strong regulatory strategy input.",
          date: "2026-03-12",
          client: "Client feedback"
        }
      ],
      documents: [
        { id: uid("DOC"), type: "CV", title: `${name.split(" ")[0]} - CV.pdf`, date: "2025-11-02", note: "Updated CV" },
        { id: uid("DOC"), type: "Agreement", title: "Consultant NDA & Master Agreement.pdf", date: "2025-06-18", note: "Signed" },
        { id: uid("DOC"), type: "License", title: "Professional registration certificate.pdf", date: "2025-01-05", note: "" },
      ],
      linkedinUrl: "",
      lastSynced: null,
      status: i % 9 === 0 ? "On Assignment" : "Available",
      notes: "",
    };
  });
}

/**
 * Generate a list of seed client records.
 * @returns {Array} Array of client objects.
 */
export function seedClients() {
  return [
    { id: uid("CL"), company: "Nova Biopharma Inc.", contact: "Sarah Lin", email: "sarah.lin@novabio.example" },
    { id: uid("CL"), company: "Meridian MedTech", contact: "Tom Becker", email: "tbecker@meridianmed.example" },
    { id: uid("CL"), company: "PureLeaf Consumer Goods", contact: "Ana Torres", email: "ana.torres@pureleaf.example" },
  ];
}

/**
 * Generate seed inquiry records based on existing consultants and clients.
 * @param {Array} consultants
 * @param {Array} clients
 * @returns {Array} Array of inquiry objects.
 */
export function seedInquiries(consultants, clients) {
  return [
    {
      id: uid("INQ"),
      clientId: clients[0].id,
      title: "EU MDR Class IIb submission support",
      description: "Need regulatory support for a Class IIb cardiovascular device entering the EU market under MDR.",
      region: "EU",
      category: "Medical Device",
      requiredExpertise: "EU MDR",
      stage: "Matched",
      consultantId: consultants.find(c => c.region === "EU")?.id || consultants[0].id,
      createdAt: "2026-06-20",
    },
    {
      id: uid("INQ"),
      clientId: clients[1].id,
      title: "India CDSCO registration for diagnostic device",
      description: "Import license and CDSCO registration required for an IVD diagnostic kit.",
      region: "SASIA",
      category: "Medical Device",
      requiredExpertise: "CDSCO India",
      stage: "New",
      consultantId: null,
      createdAt: "2026-06-28",
    },
  ];
}
