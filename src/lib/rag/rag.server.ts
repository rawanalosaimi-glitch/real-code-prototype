import { CHUNKS, DOC_BY_ID, type Chunk } from "./corpus";

const GATEWAY = "https://ai.gateway.lovable.dev/v1";
const EMBEDDING_MODEL = "google/gemini-embedding-2";
const CHAT_MODEL = "google/gemini-3.7-flash";

export type Retrieved = {
  chunkId: string;
  similarity: number;
  section: string;
  page: number;
  text: string;
  recommendedAction: string;
  document: string;
  issuer: string;
  reference: string;
  url: string;
};

export type RagAnswer = {
  answer: string;
  matched: boolean;
  engine: "embeddings+llm" | "keyword-fallback";
  sources: Retrieved[];
  recommendedAction: string | null;
};

function apiKey() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return key;
}

async function embed(inputs: string[]): Promise<number[][]> {
  const res = await fetch(`${GATEWAY}/embeddings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey(),
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: inputs }),
  });
  if (!res.ok) {
    throw new Error(`Embedding request failed (${res.status}): ${await res.text()}`);
  }
  const json = (await res.json()) as {
    data: { index: number; embedding: number[] }[];
  };
  return json.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
}

// In-memory vector index. Built once per server instance from the chunked corpus.
let vectorIndex: { chunk: Chunk; vector: number[] }[] | null = null;
let indexPromise: Promise<{ chunk: Chunk; vector: number[] }[]> | null = null;

async function getVectorIndex() {
  if (vectorIndex) return vectorIndex;
  if (!indexPromise) {
    indexPromise = (async () => {
      const vectors = await embed(
        CHUNKS.map((c) => `${c.section}\n${c.text}`),
      );
      vectorIndex = CHUNKS.map((chunk, i) => ({ chunk, vector: vectors[i]! }));
      return vectorIndex;
    })().catch((err) => {
      indexPromise = null;
      throw err;
    });
  }
  return indexPromise;
}

function cosine(a: number[], b: number[]) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    const x = a[i]!;
    const y = b[i]!;
    dot += x * y;
    na += x * x;
    nb += y * y;
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

function toRetrieved(chunk: Chunk, similarity: number): Retrieved {
  const doc = DOC_BY_ID[chunk.docId]!;
  return {
    chunkId: chunk.id,
    similarity,
    section: chunk.section,
    page: chunk.page,
    text: chunk.text,
    recommendedAction: chunk.recommendedAction,
    document: doc.title,
    issuer: doc.issuer,
    reference: doc.reference,
    url: doc.url,
  };
}

const NO_MATCH =
  "I could not find a matching topic in the indexed regulatory documents. Try asking about dose limits, leaks or contamination, monitoring and calibration, ALARA optimisation, access control, risk assessment, emergency response or data privacy.";

function keywordFallback(question: string): RagAnswer {
  const q = question.toLowerCase();
  const scored = CHUNKS.map((chunk) => {
    const hits = chunk.topics.filter((t) => q.includes(t)).length;
    return { chunk, hits };
  })
    .filter((s) => s.hits > 0)
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 2);

  if (scored.length === 0) {
    return {
      answer: NO_MATCH,
      matched: false,
      engine: "keyword-fallback",
      sources: [],
      recommendedAction: null,
    };
  }

  const sources = scored.map((s) => toRetrieved(s.chunk, s.hits / s.chunk.topics.length));
  return {
    answer: `${sources[0]!.text}\n\n(Keyword retrieval was used because the AI service was unavailable.)`,
    matched: true,
    engine: "keyword-fallback",
    sources,
    recommendedAction: sources[0]!.recommendedAction,
  };
}

const SYSTEM_PROMPT = `You are ALARAD, a radiation safety compliance assistant for a medical facility in Saudi Arabia.
Answer ONLY from the retrieved regulatory excerpts provided by the user message.
Rules:
- Answer in 2-4 sentences, precise and operational.
- Always name the issuing body (NRRC, IAEA or Facility) whose requirement applies.
- Never invent regulation numbers, dose values or page numbers.
- If the excerpts do not answer the question, reply exactly: NO_MATCH`;

export async function answerQuestion(question: string): Promise<RagAnswer> {
  try {
    const index = await getVectorIndex();
    const [queryVector] = await embed([question]);
    const ranked = index
      .map(({ chunk, vector }) => ({ chunk, similarity: cosine(queryVector!, vector) }))
      .sort((a, b) => b.similarity - a.similarity);

    const top = ranked.slice(0, 3).filter((r) => r.similarity >= 0.55);
    if (top.length === 0) {
      return {
        answer: NO_MATCH,
        matched: false,
        engine: "embeddings+llm",
        sources: [],
        recommendedAction: null,
      };
    }

    const sources = top.map((r) => toRetrieved(r.chunk, r.similarity));
    const context = sources
      .map(
        (s, i) =>
          `[${i + 1}] ${s.issuer} — ${s.document}\nSection: ${s.section}\nPage: ${s.page}\n${s.text}`,
      )
      .join("\n\n");

    const res = await fetch(`${GATEWAY}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey(),
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Retrieved excerpts:\n\n${context}\n\nQuestion: ${question}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      if (res.status === 402 || res.status === 403) {
        throw new Error(`AI service unavailable (${res.status}): ${body}`);
      }
      throw new Error(`Chat request failed (${res.status}): ${body}`);
    }

    const json = (await res.json()) as {
      choices: { message: { content: string } }[];
    };
    const text = json.choices?.[0]?.message?.content?.trim() ?? "";

    if (!text || text.includes("NO_MATCH")) {
      return {
        answer: NO_MATCH,
        matched: false,
        engine: "embeddings+llm",
        sources: [],
        recommendedAction: null,
      };
    }

    return {
      answer: text,
      matched: true,
      engine: "embeddings+llm",
      sources,
      recommendedAction: sources[0]!.recommendedAction,
    };
  } catch (error) {
    console.error("[ALARAD RAG]", error);
    return keywordFallback(question);
  }
}
