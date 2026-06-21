// StackTrack compound database — ported unchanged from the prototype.
// Add or edit entries here; every screen imports from this single source.

export const COMPOUNDS = [
  // ── AAS ──────────────────────────────────────────────────────────────────────
  { name: "Testosterone Enanthate", category: "AAS", halfLife: "4.5 days", unit: "mg", commonDose: "250-500mg/week", frequency: "Twice/week" },
  { name: "Testosterone Cypionate", category: "AAS", halfLife: "5 days", unit: "mg", commonDose: "200-600mg/week", frequency: "Twice/week" },
  { name: "Testosterone Propionate", category: "AAS", halfLife: "2 days", unit: "mg", commonDose: "50-100mg/EOD", frequency: "EOD" },
  { name: "Testosterone Undecanoate", category: "AAS", halfLife: "21 days", unit: "mg", commonDose: "250mg/3 weeks", frequency: "Once/month" },
  { name: "Testosterone Suspension", category: "AAS", halfLife: "~24 hrs", unit: "mg", commonDose: "50-100mg/day", frequency: "Daily" },
  { name: "Nandrolone Decanoate", category: "AAS", halfLife: "6 days", unit: "mg", commonDose: "200-400mg/week", frequency: "Once/week" },
  { name: "Nandrolone Phenylpropionate", category: "AAS", halfLife: "2.5 days", unit: "mg", commonDose: "100-200mg/EOD", frequency: "EOD" },
  { name: "Trenbolone Acetate", category: "AAS", halfLife: "1 day", unit: "mg", commonDose: "50-100mg/EOD", frequency: "EOD" },
  { name: "Trenbolone Enanthate", category: "AAS", halfLife: "5 days", unit: "mg", commonDose: "200-400mg/week", frequency: "Twice/week" },
  { name: "Trenbolone Hexahydrobenzylcarbonate", category: "AAS", halfLife: "~6 days", unit: "mg", commonDose: "150-300mg/week", frequency: "Twice/week" },
  { name: "Boldenone Undecylenate", category: "AAS", halfLife: "14 days", unit: "mg", commonDose: "300-500mg/week", frequency: "Once/week" },
  { name: "Stanozolol (oral)", category: "AAS", halfLife: "9 hrs", unit: "mg", commonDose: "25-50mg/day", frequency: "Daily" },
  { name: "Stanozolol (injectable)", category: "AAS", halfLife: "24 hrs", unit: "mg", commonDose: "50mg/EOD", frequency: "EOD" },
  { name: "Oxandrolone", category: "AAS", halfLife: "9 hrs", unit: "mg", commonDose: "20-80mg/day", frequency: "Daily" },
  { name: "Methandrostenolone", category: "AAS", halfLife: "4-6 hrs", unit: "mg", commonDose: "20-50mg/day", frequency: "Daily" },
  { name: "Oxymetholone", category: "AAS", halfLife: "8-9 hrs", unit: "mg", commonDose: "25-100mg/day", frequency: "Daily" },
  { name: "Fluoxymesterone", category: "AAS", halfLife: "9-10 hrs", unit: "mg", commonDose: "10-40mg/day", frequency: "Daily" },
  { name: "Masteron Propionate", category: "AAS", halfLife: "2.5 days", unit: "mg", commonDose: "100mg/EOD", frequency: "EOD" },
  { name: "Masteron Enanthate", category: "AAS", halfLife: "5 days", unit: "mg", commonDose: "200-400mg/week", frequency: "Twice/week" },
  { name: "Primobolan (oral)", category: "AAS", halfLife: "4-6 hrs", unit: "mg", commonDose: "50-150mg/day", frequency: "Daily" },
  { name: "Primobolan Enanthate", category: "AAS", halfLife: "~5 days", unit: "mg", commonDose: "300-600mg/week", frequency: "Twice/week" },
  { name: "Superdrol", category: "AAS", halfLife: "8-12 hrs", unit: "mg", commonDose: "10-20mg/day", frequency: "Daily" },
  { name: "Turinabol", category: "AAS", halfLife: "~16 hrs", unit: "mg", commonDose: "20-60mg/day", frequency: "Daily" },
  { name: "Mibolerone", category: "AAS", halfLife: "~4 hrs", unit: "mg", commonDose: "0.5-3mg/day", frequency: "Daily" },
  { name: "Halotestin", category: "AAS", halfLife: "6-8 hrs", unit: "mg", commonDose: "10-40mg/day", frequency: "Daily" },

  // ── Peptides ─────────────────────────────────────────────────────────────────
  { name: "BPC-157", category: "Peptide", halfLife: "~4 hrs", unit: "mcg", commonDose: "250-500mcg/day", frequency: "Daily" },
  { name: "TB-500", category: "Peptide", halfLife: "~days", unit: "mg", commonDose: "2-5mg/week", frequency: "Twice/week" },
  { name: "CJC-1295 (no DAC)", category: "Peptide", halfLife: "30 min", unit: "mcg", commonDose: "100mcg/dose", frequency: "Daily" },
  { name: "CJC-1295 (with DAC)", category: "Peptide", halfLife: "6-8 days", unit: "mcg", commonDose: "1-2mg/week", frequency: "Once/week" },
  { name: "Ipamorelin", category: "Peptide", halfLife: "~2 hrs", unit: "mcg", commonDose: "100-300mcg/dose", frequency: "Daily" },
  { name: "GHRP-2", category: "Peptide", halfLife: "~1 hr", unit: "mcg", commonDose: "100-300mcg/dose", frequency: "Daily" },
  { name: "GHRP-6", category: "Peptide", halfLife: "~2-3 hrs", unit: "mcg", commonDose: "100-300mcg/dose", frequency: "Daily" },
  { name: "Hexarelin", category: "Peptide", halfLife: "~70 min", unit: "mcg", commonDose: "100-200mcg/dose", frequency: "Daily" },
  { name: "Sermorelin", category: "Peptide", halfLife: "~11 min", unit: "mcg", commonDose: "200-500mcg/night", frequency: "Daily" },
  { name: "Tesamorelin", category: "Peptide", halfLife: "~26 min", unit: "mg", commonDose: "1-2mg/day", frequency: "Daily" },
  { name: "HGH", category: "Peptide", halfLife: "~3 hrs", unit: "IU", commonDose: "2-4 IU/day", frequency: "Daily" },
  { name: "IGF-1 LR3", category: "Peptide", halfLife: "20-30 hrs", unit: "mcg", commonDose: "20-120mcg/day", frequency: "Daily" },
  { name: "IGF-1 DES", category: "Peptide", halfLife: "~20-30 min", unit: "mcg", commonDose: "50-150mcg/dose", frequency: "Daily" },
  { name: "MGF (Mechano Growth Factor)", category: "Peptide", halfLife: "~minutes", unit: "mcg", commonDose: "100-200mcg/post-workout", frequency: "EOD" },
  { name: "PT-141 (Bremelanotide)", category: "Peptide", halfLife: "~2-3 hrs", unit: "mg", commonDose: "1-2mg/dose", frequency: "As needed" },
  { name: "Melanotan II", category: "Peptide", halfLife: "~2 hrs", unit: "mg", commonDose: "0.25-1mg/day", frequency: "Daily" },
  { name: "Epithalon", category: "Peptide", halfLife: "~hours", unit: "mg", commonDose: "5-10mg/day", frequency: "Daily" },
  { name: "Selank", category: "Peptide", halfLife: "~minutes", unit: "mcg", commonDose: "250-500mcg/dose", frequency: "Daily" },
  { name: "Semax", category: "Peptide", halfLife: "~minutes", unit: "mcg", commonDose: "200-600mcg/dose", frequency: "Daily" },
  { name: "SS-31 (Elamipretide)", category: "Peptide", halfLife: "~hrs", unit: "mg", commonDose: "0.1-0.25mg/kg/day", frequency: "Daily" },
  { name: "ARA-290", category: "Peptide", halfLife: "~hrs", unit: "mg", commonDose: "4mg/day", frequency: "Daily" },
  { name: "GHK-Cu", category: "Peptide", halfLife: "~hrs", unit: "mg", commonDose: "1-2mg/day", frequency: "Daily" },
  { name: "KPV", category: "Peptide", halfLife: "~hrs", unit: "mg", commonDose: "0.5-1mg/day", frequency: "Daily" },
  { name: "LL-37", category: "Peptide", halfLife: "~hrs", unit: "mg", commonDose: "0.5-1mg/day", frequency: "Daily" },
  { name: "5-Amino-1MQ", category: "Peptide", halfLife: "~hrs", unit: "mg", commonDose: "50-100mg/day", frequency: "Daily" },
  { name: "AOD-9604", category: "Peptide", halfLife: "~hrs", unit: "mcg", commonDose: "250-300mcg/day", frequency: "Daily" },
  { name: "DSIP (Delta Sleep Inducing Peptide)", category: "Peptide", halfLife: "~mins", unit: "mcg", commonDose: "100-500mcg/dose", frequency: "Daily" },
  { name: "VIP (Vasoactive Intestinal Peptide)", category: "Peptide", halfLife: "~1-2 min", unit: "mcg", commonDose: "50mcg/dose", frequency: "Daily" },
  { name: "Thymosin Alpha-1", category: "Peptide", halfLife: "~2 hrs", unit: "mg", commonDose: "1.6mg/twice weekly", frequency: "Twice/week" },

  // ── SARMs ────────────────────────────────────────────────────────────────────
  { name: "Ostarine (MK-2866)", category: "SARM", halfLife: "24 hrs", unit: "mg", commonDose: "10-30mg/day", frequency: "Daily" },
  { name: "Ligandrol (LGD-4033)", category: "SARM", halfLife: "24-36 hrs", unit: "mg", commonDose: "5-15mg/day", frequency: "Daily" },
  { name: "RAD-140 (Testolone)", category: "SARM", halfLife: "~60 hrs", unit: "mg", commonDose: "10-20mg/day", frequency: "Daily" },
  { name: "Andarine (S4)", category: "SARM", halfLife: "~4 hrs", unit: "mg", commonDose: "25-75mg/day", frequency: "Daily" },
  { name: "Cardarine (GW-501516)", category: "SARM", halfLife: "~16-24 hrs", unit: "mg", commonDose: "10-20mg/day", frequency: "Daily" },
  { name: "YK-11", category: "SARM", halfLife: "~6-10 hrs", unit: "mg", commonDose: "5-15mg/day", frequency: "Daily" },
  { name: "S23", category: "SARM", halfLife: "~12 hrs", unit: "mg", commonDose: "10-30mg/day", frequency: "Daily" },
  { name: "Ibutamoren (MK-677)", category: "SARM", halfLife: "~24 hrs", unit: "mg", commonDose: "10-25mg/day", frequency: "Daily" },
  { name: "SR9009 (Stenabolic)", category: "SARM", halfLife: "~4 hrs", unit: "mg", commonDose: "20-30mg/day", frequency: "Daily" },
  { name: "ACP-105", category: "SARM", halfLife: "~hrs", unit: "mg", commonDose: "5-15mg/day", frequency: "Daily" },
  { name: "LGD-3303", category: "SARM", halfLife: "~6 hrs", unit: "mg", commonDose: "15-30mg/day", frequency: "Daily" },
  { name: "RAD-150 (TLB-150)", category: "SARM", halfLife: "~48 hrs", unit: "mg", commonDose: "5-15mg/day", frequency: "Daily" },

  // ── Nootropics ───────────────────────────────────────────────────────────────
  { name: "Modafinil", category: "Nootropic", halfLife: "12-15 hrs", unit: "mg", commonDose: "100-200mg/day", frequency: "Daily" },
  { name: "Armodafinil", category: "Nootropic", halfLife: "15 hrs", unit: "mg", commonDose: "75-150mg/day", frequency: "Daily" },
  { name: "Noopept", category: "Nootropic", halfLife: "~30-60 min", unit: "mg", commonDose: "10-30mg/day", frequency: "Daily" },
  { name: "Phenylpiracetam", category: "Nootropic", halfLife: "3-5 hrs", unit: "mg", commonDose: "100-200mg/dose", frequency: "EOD" },
  { name: "Aniracetam", category: "Nootropic", halfLife: "1-2.5 hrs", unit: "mg", commonDose: "750-1500mg/day", frequency: "Daily" },
  { name: "Oxiracetam", category: "Nootropic", halfLife: "~8 hrs", unit: "mg", commonDose: "800-2400mg/day", frequency: "Daily" },
  { name: "Pramiracetam", category: "Nootropic", halfLife: "~5 hrs", unit: "mg", commonDose: "400-1200mg/day", frequency: "Daily" },
  { name: "Piracetam", category: "Nootropic", halfLife: "5-6 hrs", unit: "mg", commonDose: "1600-4800mg/day", frequency: "Daily" },
  { name: "Alpha-GPC", category: "Nootropic", halfLife: "~4-6 hrs", unit: "mg", commonDose: "300-600mg/day", frequency: "Daily" },
  { name: "CDP-Choline (Citicoline)", category: "Nootropic", halfLife: "~56 hrs", unit: "mg", commonDose: "250-500mg/day", frequency: "Daily" },
  { name: "Lion's Mane Extract", category: "Nootropic", halfLife: "N/A", unit: "mg", commonDose: "500-3000mg/day", frequency: "Daily" },
  { name: "Bacopa Monnieri", category: "Nootropic", halfLife: "~hrs", unit: "mg", commonDose: "300-600mg/day", frequency: "Daily" },
  { name: "Phosphatidylserine", category: "Nootropic", halfLife: "~hrs", unit: "mg", commonDose: "100-300mg/day", frequency: "Daily" },
  { name: "NSI-189", category: "Nootropic", halfLife: "~hrs", unit: "mg", commonDose: "40-80mg/day", frequency: "Daily" },
  { name: "Semax (intranasal)", category: "Nootropic", halfLife: "~minutes", unit: "mcg", commonDose: "200-600mcg/dose", frequency: "Daily" },
  { name: "Dihexa", category: "Nootropic", halfLife: "~hrs", unit: "mg", commonDose: "10-30mg/day", frequency: "Daily" },
  { name: "Cerebrolysin", category: "Nootropic", halfLife: "~hrs", unit: "ml", commonDose: "5-10ml/day (cycle)", frequency: "Daily" },
  { name: "Methylene Blue", category: "Nootropic", halfLife: "~5-6 hrs", unit: "mg", commonDose: "0.5-4mg/kg", frequency: "Daily" },
  { name: "Bromantane", category: "Nootropic", halfLife: "~11 hrs", unit: "mg", commonDose: "50-100mg/day", frequency: "Daily" },

  // ── Blends ───────────────────────────────────────────────────────────────────
  { name: "Klow (BPC-157 / TB-500 / GHK-Cu / KPV)", category: "Blend", halfLife: "~4 hrs (BPC limiting)", unit: "mcg", commonDose: "250-500mcg/day", frequency: "Daily" },

  // ── GLP-1 ────────────────────────────────────────────────────────────────────
  { name: "Semaglutide", category: "GLP-1", halfLife: "7 days", unit: "mg", commonDose: "0.25-2.4mg/week", frequency: "Once/week" },
  { name: "Tirzepatide", category: "GLP-1", halfLife: "5 days", unit: "mg", commonDose: "2.5-15mg/week", frequency: "Once/week" },
  { name: "Retatrutide", category: "GLP-1", halfLife: "~6 days", unit: "mg", commonDose: "1-12mg/week", frequency: "Once/week" },
  { name: "Liraglutide", category: "GLP-1", halfLife: "13 hrs", unit: "mg", commonDose: "0.6-3mg/day", frequency: "Daily" },

  // ── PCT ──────────────────────────────────────────────────────────────────────
  { name: "Tamoxifen (Nolvadex)", category: "PCT", halfLife: "5-7 days", unit: "mg", commonDose: "20-40mg/day", frequency: "Daily" },
  { name: "Clomiphene (Clomid)", category: "PCT", halfLife: "5-7 days", unit: "mg", commonDose: "25-50mg/day", frequency: "Daily" },
  { name: "Enclomiphene", category: "PCT", halfLife: "~10 hrs", unit: "mg", commonDose: "12.5-25mg/day", frequency: "Daily" },
  { name: "hCG", category: "PCT", halfLife: "~36 hrs", unit: "IU", commonDose: "500-1000 IU/3x week", frequency: "E3D" },
  { name: "hMG", category: "PCT", halfLife: "~hrs", unit: "IU", commonDose: "75-150 IU/3x week", frequency: "E3D" },
  { name: "Gonadorelin", category: "PCT", halfLife: "~2-10 min", unit: "mcg", commonDose: "100mcg/2x week", frequency: "Twice/week" },

  // ── AI ───────────────────────────────────────────────────────────────────────
  { name: "Anastrozole (Arimidex)", category: "AI", halfLife: "46 hrs", unit: "mg", commonDose: "0.25-1mg/EOD", frequency: "EOD" },
  { name: "Exemestane (Aromasin)", category: "AI", halfLife: "27 hrs", unit: "mg", commonDose: "12.5-25mg/EOD", frequency: "EOD" },
  { name: "Letrozole (Femara)", category: "AI", halfLife: "~2 days", unit: "mg", commonDose: "0.25-2.5mg/EOD", frequency: "EOD" },
  { name: "Proviron", category: "AI", halfLife: "12-13 hrs", unit: "mg", commonDose: "25-75mg/day", frequency: "Daily" },
];

export const FREQUENCIES = ["Daily", "EOD", "E3D", "Twice/week", "Once/week", "Twice/month"];

export const INJECTION_SITES = ["Left Delt", "Right Delt", "Left Glute", "Right Glute", "Left Quad", "Right Quad", "Left Lat", "Right Lat", "Abdomen"];
