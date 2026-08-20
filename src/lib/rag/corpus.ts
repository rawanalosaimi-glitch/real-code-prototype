// Regulatory corpus used by the ALARAD retrieval-augmented answering pipeline.
//
// Pipeline: Official documents -> text extraction -> chunking -> embeddings ->
// vector index -> semantic retrieval -> LLM -> answer + source + page.
//
// The excerpts below are the chunked, extracted text of the reference documents
// (paraphrased summaries of the cited requirements for prototype use). Each chunk
// keeps its document title, page number and link so every AI answer can be traced
// back to the exact page of the source document.

export type DocMeta = {
  id: string;
  title: string;
  issuer: "NRRC" | "IAEA" | "Facility";
  reference: string;
  url: string;
};

export type Chunk = {
  id: string;
  docId: string;
  section: string;
  page: number;
  text: string;
  recommendedAction: string;
  topics: string[];
};

export const DOCUMENTS: DocMeta[] = [
  {
    id: "nrrc-rsr",
    title: "NRRC — Radiation Safety Regulations",
    issuer: "NRRC",
    reference: "NRRC RSR (Kingdom of Saudi Arabia)",
    url: "https://nrrc.gov.sa/en/regulations",
  },
  {
    id: "iaea-gsr3",
    title: "IAEA GSR Part 3 — Radiation Protection and Safety of Radiation Sources",
    issuer: "IAEA",
    reference: "IAEA General Safety Requirements Part 3",
    url: "https://www.iaea.org/publications/8930/radiation-protection-and-safety-of-radiation-sources-international-basic-safety-standards",
  },
  {
    id: "facility-alara",
    title: "Facility ALARA Programme & Emergency Response Plan",
    issuer: "Facility",
    reference: "Internal SOP RS-07 / ERP v1.9",
    url: "https://www.iaea.org/resources/safety-standards",
  },
];

export const CHUNKS: Chunk[] = [
  {
    id: "nrrc-dose-limits",
    docId: "nrrc-rsr",
    section: "Compliance with Dose Limits",
    page: 42,
    topics: ["dose", "limit", "occupational", "mSv", "exposure"],
    recommendedAction: "Review by Radiation Safety Officer",
    text: "Occupational exposure of workers shall be controlled so that the effective dose does not exceed 20 mSv per year averaged over five consecutive years, with no single year exceeding 50 mSv. The licensee shall establish investigation levels below the limit. When a worker's recorded dose approaches the applicable limit, the licensee shall suspend or restrict the worker's assignment to radiation work, investigate the cause of the exposure, record the investigation, notify the Radiation Safety Officer, and report to the regulatory body within the prescribed period. Corrective actions shall include review of working practices, reassignment of duties and, where indicated, medical follow-up.",
  },
  {
    id: "nrrc-waste-areas",
    docId: "nrrc-rsr",
    section: "Control of Radioactive Waste Areas",
    page: 88,
    topics: ["leak", "waste", "spill", "contamination", "storage", "dose rate"],
    recommendedAction: "Isolate area and notify Radiation Safety Officer within 1 hour",
    text: "Radioactive waste storage areas shall be controlled areas with access restricted to authorised workers. Where a leak, spill or unexpected increase in the ambient dose rate is detected, the licensee shall immediately restrict access, delineate the affected area, perform contamination surveys, and notify the Radiation Safety Officer without undue delay. The event shall be recorded and, if a dose limit may be exceeded or a source may be lost, reported to the regulatory body as an abnormal occurrence.",
  },
  {
    id: "nrrc-monitoring",
    docId: "nrrc-rsr",
    section: "Individual Monitoring and Dose Records",
    page: 57,
    topics: ["dosimeter", "monitoring", "calibration", "records", "dose"],
    recommendedAction: "Verify dosimeter calibration and update the individual dose record",
    text: "Each worker who may receive an occupational dose shall be provided with an approved individual monitoring device. Monitoring instruments and dosimeters shall be calibrated at intervals not exceeding the manufacturer's or regulatory interval, and calibration certificates retained. Individual dose records shall be maintained for the working life of the worker and retained thereafter, and shall be made available to the worker and to the regulatory body on request.",
  },
  {
    id: "iaea-optimisation",
    docId: "iaea-gsr3",
    section: "Requirement 11 — Optimisation of Protection (ALARA)",
    page: 33,
    topics: ["alara", "optimisation", "risk", "shielding", "time", "distance"],
    recommendedAction: "Apply ALARA controls: reduce time, increase distance, add shielding",
    text: "Protection and safety shall be optimised so that the magnitude of individual doses, the number of people exposed and the likelihood of exposure are as low as reasonably achievable, taking economic and societal factors into account. Optimisation is achieved through dose constraints, engineering controls and administrative controls, applying the principles of reduced exposure time, increased distance from the source and adequate shielding.",
  },
  {
    id: "iaea-access-control",
    docId: "iaea-gsr3",
    section: "Requirement 24 — Controlled and Supervised Areas",
    page: 121,
    topics: ["access", "restricted", "zone", "privacy", "authorisation", "control"],
    recommendedAction: "Verify authorisation, review dosimeter reading and retrain the worker",
    text: "The employer shall designate controlled areas where specific protective measures or safety provisions are required, restrict access to authorised persons, post warning signs, and provide written procedures for entry and exit. Records of entry to controlled areas and the associated monitoring data are personal data and shall be handled confidentially, used only for radiation protection, occupational health and regulatory reporting purposes, and disclosed only to the worker concerned, the Radiation Safety Officer and the regulatory body.",
  },
  {
    id: "iaea-risk-assessment",
    docId: "iaea-gsr3",
    section: "Requirement 13 — Safety Assessment and Risk Analysis",
    page: 47,
    topics: ["risk", "assessment", "anomaly", "forecast", "trend", "analysis"],
    recommendedAction: "Escalate the risk assessment to the Radiation Safety Committee",
    text: "The licensee shall carry out a safety assessment that identifies credible exposure scenarios, evaluates the likelihood and magnitude of exposures, and is reviewed whenever monitoring data indicate a change in risk. Trends in monitoring results and anomalous readings shall be analysed; where the analysis indicates an increasing risk of exceeding a dose constraint, additional protective measures shall be implemented and the assessment updated and documented.",
  },
  {
    id: "facility-emergency",
    docId: "facility-alara",
    section: "Emergency Response — Elevated Dose Rate",
    page: 12,
    topics: ["emergency", "leak", "evacuation", "response", "alarm", "dose rate"],
    recommendedAction: "Activate the emergency response team and evacuate via the nearest safe route",
    text: "On detection of an ambient dose rate exceeding twice the alarm threshold, staff shall leave the affected room by the nearest safe exit, close the door, prevent re-entry and call the Radiation Safety Officer on the emergency number. The response team confirms boundaries with a calibrated survey meter, records GPS positions of monitored personnel, and reconstructs individual doses for every worker present during the event.",
  },
  {
    id: "facility-data-privacy",
    docId: "facility-alara",
    section: "Dose Data Governance and Privacy",
    page: 21,
    topics: ["privacy", "data", "confidential", "records", "consent"],
    recommendedAction: "Restrict dose record access to authorised radiation protection staff",
    text: "Individual dose data, staff location traces and exposure histories are confidential occupational health records. Access is limited to the worker, the Radiation Safety Officer and authorised regulatory inspectors. Analytics and AI features operate on the minimum necessary data, dose values displayed in dashboards must originate from calibrated dosimetry systems, and any illustrative or simulated values must be clearly labelled as such and never used for clinical or regulatory decisions.",
  },
];

export const DOC_BY_ID = Object.fromEntries(DOCUMENTS.map((d) => [d.id, d]));
