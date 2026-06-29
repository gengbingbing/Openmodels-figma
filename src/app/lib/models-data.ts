export interface ProviderRoute {
  provider: string;
  input: number;
  output: number;
  latency: string;
  availability: "Live" | "Limited" | "Offline";
  supply: "Direct" | "Verified" | "Limited";
  label: "Lowest price" | "Recommended" | "Lowest latency" | "Auto eligible" | "Direct" | "Limited capacity";
  uptime?: number; /* 0–100 percentage */
}

export interface PricingTier {
  tier: string;
  billing: string;
  input: number;
  output: number;
  cacheWrite?: number;
  cacheRead?: number;
}

export interface Endpoint {
  path: string;
  method: "POST" | "GET";
}

export interface ModelData {
  id: string;
  name: string;
  shortName: string;
  provider: string;
  input: number;       // lowest available price across routes
  output: number;
  context: string;
  maxOutput?: string;
  tags: string[];
  status: "Live" | "Limited" | "Coming soon";
  supply: "Direct" | "Verified" | "Limited";
  description: string;
  features: string[];
  releaseDate?: string;
  useCases?: string;
  providerRoutes: ProviderRoute[];
  pricingTiers: PricingTier[];
  endpoints: Endpoint[];
  apiModelId: string;
}

export const allModels: ModelData[] = [
  {
    id: "minimax-m2.7",
    name: "MiniMax/MiniMax-M2.7",
    shortName: "MiniMax-M2.7",
    provider: "MiniMax",
    input: 2.00,
    output: 8.00,
    context: "128K",
    maxOutput: "8K",
    tags: ["Chat", "Reasoning"],
    status: "Live",
    supply: "Verified",
    description: "MiniMax-M2.7 is an open-source model available through OpenModels with transparent token pricing, verified supply, and OpenAI-compatible API access.",
    features: ["Chat", "Tool use", "Streaming", "JSON mode"],
    releaseDate: "2025-05",
    useCases: "General chat, reasoning, tool-augmented agents",
    providerRoutes: [
      { provider: "Novita",   input: 2.00, output: 8.00, latency: "820ms",  availability: "Live",    supply: "Verified", label: "Lowest price", uptime: 99.8 },
      { provider: "MiniMax",  input: 2.10, output: 8.40, latency: "640ms",  availability: "Live",    supply: "Verified", label: "Recommended", uptime: 99.5 },
    ],
    pricingTiers: [
      { tier: "Official model access", billing: "Pay per token", input: 2.00, output: 8.00, cacheWrite: 2.50, cacheRead: 0.40 },
    ],
    endpoints: [
      { path: "openai: /v1/chat/completions", method: "POST" },
      { path: "anthropic: /v1/messages",      method: "POST" },
    ],
    apiModelId: "minimax-m2.7",
  },
  {
    id: "llama-3.1-70b",
    name: "Meta/Llama-3.1-70B",
    shortName: "Llama-3.1-70B",
    provider: "Meta",
    input: 0.38,
    output: 0.65,
    context: "128K",
    maxOutput: "4K",
    tags: ["Chat", "Coding"],
    status: "Live",
    supply: "Direct",
    description: "Meta's Llama 3.1 70B is a high-capability open model with direct supply through OpenModels. Ideal for chat, code generation, and general-purpose tasks with OpenAI-compatible API access.",
    features: ["Chat", "Coding", "Tool use", "Streaming", "JSON mode"],
    releaseDate: "2024-07",
    useCases: "Chat, code generation, instruction following",
    providerRoutes: [
      { provider: "Together AI", input: 0.38, output: 0.65, latency: "760ms",  availability: "Live",    supply: "Direct",   label: "Lowest price", uptime: 99.8 },
      { provider: "Groq",        input: 0.40, output: 0.70, latency: "320ms",  availability: "Live",    supply: "Verified", label: "Lowest latency", uptime: 99.9 },
      { provider: "Replicate",   input: 0.42, output: 0.72, latency: "950ms",  availability: "Live",    supply: "Verified", label: "Auto eligible", uptime: 99.2 },
      { provider: "Novita",      input: 0.41, output: 0.71, latency: "820ms",  availability: "Live",    supply: "Verified", label: "Auto eligible", uptime: 99.2 },
    ],
    pricingTiers: [
      { tier: "Official model access", billing: "Pay per token", input: 0.38, output: 0.65, cacheWrite: 0.48, cacheRead: 0.076 },
    ],
    endpoints: [
      { path: "openai: /v1/chat/completions", method: "POST" },
    ],
    apiModelId: "llama-3.1-70b",
  },
  {
    id: "llama-3.1-8b",
    name: "Meta/Llama-3.1-8B",
    shortName: "Llama-3.1-8B",
    provider: "Meta",
    input: 0.05,
    output: 0.10,
    context: "128K",
    maxOutput: "4K",
    tags: ["Chat", "Coding"],
    status: "Live",
    supply: "Direct",
    description: "Meta's Llama 3.1 8B is a lightweight, fast model with direct supply. Excellent price-to-performance ratio for high-throughput applications.",
    features: ["Chat", "Coding", "Streaming", "JSON mode"],
    releaseDate: "2024-07",
    useCases: "High-volume chat, classification, summarization",
    providerRoutes: [
      { provider: "Groq",        input: 0.05, output: 0.10, latency: "180ms",  availability: "Live",    supply: "Direct",   label: "Lowest price", uptime: 99.8 },
      { provider: "Together AI", input: 0.06, output: 0.12, latency: "340ms",  availability: "Live",    supply: "Verified", label: "Auto eligible", uptime: 99.2 },
      { provider: "Novita",      input: 0.06, output: 0.11, latency: "290ms",  availability: "Live",    supply: "Verified", label: "Auto eligible", uptime: 99.2 },
    ],
    pricingTiers: [
      { tier: "Official model access", billing: "Pay per token", input: 0.05, output: 0.10, cacheWrite: 0.063, cacheRead: 0.010 },
    ],
    endpoints: [
      { path: "openai: /v1/chat/completions", method: "POST" },
    ],
    apiModelId: "llama-3.1-8b",
  },
  {
    id: "qwen-2.5-72b",
    name: "Alibaba/Qwen-2.5-72B",
    shortName: "Qwen-2.5-72B",
    provider: "Alibaba",
    input: 0.32,
    output: 0.58,
    context: "128K",
    maxOutput: "8K",
    tags: ["Chat", "Coding", "Reasoning"],
    status: "Live",
    supply: "Verified",
    description: "Qwen 2.5 72B is Alibaba's flagship open model available through multiple verified routes. Strong multilingual capabilities, advanced reasoning, and code generation.",
    features: ["Chat", "Coding", "Reasoning", "Streaming", "JSON mode", "Tool use"],
    releaseDate: "2024-09",
    useCases: "Multilingual chat, coding, complex reasoning tasks",
    providerRoutes: [
      { provider: "Novita",      input: 0.32, output: 0.58, latency: "780ms",  availability: "Live",    supply: "Verified", label: "Lowest price", uptime: 99.8 },
      { provider: "Alibaba",     input: 0.35, output: 0.60, latency: "540ms",  availability: "Live",    supply: "Direct",   label: "Recommended", uptime: 99.5 },
      { provider: "DeepInfra",   input: 0.38, output: 0.68, latency: "620ms",  availability: "Live",    supply: "Verified", label: "Auto eligible", uptime: 99.2 },
    ],
    pricingTiers: [
      { tier: "Official model access", billing: "Pay per token", input: 0.32, output: 0.58, cacheWrite: 0.40, cacheRead: 0.064 },
    ],
    endpoints: [
      { path: "openai: /v1/chat/completions", method: "POST" },
    ],
    apiModelId: "qwen-2.5-72b",
  },
  {
    id: "qwen-2.5-coder-32b",
    name: "Alibaba/Qwen-2.5-Coder-32B",
    shortName: "Qwen-2.5-Coder-32B",
    provider: "Alibaba",
    input: 0.18,
    output: 0.38,
    context: "128K",
    maxOutput: "8K",
    tags: ["Coding"],
    status: "Live",
    supply: "Verified",
    description: "Qwen 2.5 Coder 32B is a code-specialized model optimized for code completion, generation, and debugging.",
    features: ["Coding", "Streaming", "JSON mode"],
    releaseDate: "2024-11",
    useCases: "Code generation, completion, debugging, code review",
    providerRoutes: [
      { provider: "Novita",    input: 0.18, output: 0.38, latency: "560ms",  availability: "Live",    supply: "Verified", label: "Lowest price", uptime: 99.8 },
      { provider: "Alibaba",   input: 0.20, output: 0.40, latency: "420ms",  availability: "Live",    supply: "Direct",   label: "Recommended", uptime: 99.5 },
    ],
    pricingTiers: [
      { tier: "Official model access", billing: "Pay per token", input: 0.18, output: 0.38, cacheWrite: 0.225, cacheRead: 0.036 },
    ],
    endpoints: [
      { path: "openai: /v1/chat/completions", method: "POST" },
    ],
    apiModelId: "qwen-2.5-coder-32b",
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek/DeepSeek-V3",
    shortName: "DeepSeek-V3",
    provider: "DeepSeek",
    input: 0.28,
    output: 0.55,
    context: "128K",
    maxOutput: "8K",
    tags: ["Chat", "Reasoning"],
    status: "Live",
    supply: "Direct",
    description: "DeepSeek V3 is a high-performance open model with direct supply. Exceptional performance on reasoning and coding benchmarks at a competitive price point.",
    features: ["Chat", "Reasoning", "Coding", "Streaming", "Tool use"],
    releaseDate: "2024-12",
    useCases: "General chat, reasoning, coding, analysis",
    providerRoutes: [
      { provider: "DeepSeek",   input: 0.28, output: 0.55, latency: "910ms",  availability: "Live",    supply: "Direct",   label: "Lowest price", uptime: 99.8 },
      { provider: "Fireworks",  input: 0.31, output: 0.58, latency: "720ms",  availability: "Live",    supply: "Verified", label: "Auto eligible", uptime: 99.2 },
    ],
    pricingTiers: [
      { tier: "Official model access", billing: "Pay per token", input: 0.28, output: 0.55, cacheWrite: 0.35, cacheRead: 0.056 },
    ],
    endpoints: [
      { path: "openai: /v1/chat/completions", method: "POST" },
    ],
    apiModelId: "deepseek-v3",
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek/DeepSeek-R1",
    shortName: "DeepSeek-R1",
    provider: "DeepSeek",
    input: 0.50,
    output: 1.20,
    context: "64K",
    maxOutput: "16K",
    tags: ["Reasoning"],
    status: "Live",
    supply: "Direct",
    description: "DeepSeek R1 is a reasoning-focused model with extended thinking capabilities. Designed for complex multi-step problems requiring deep chain-of-thought.",
    features: ["Reasoning", "Streaming"],
    releaseDate: "2025-01",
    useCases: "Complex reasoning, math, science, multi-step problem solving",
    providerRoutes: [
      { provider: "DeepSeek",   input: 0.50, output: 1.20, latency: "1240ms", availability: "Live",    supply: "Direct",   label: "Lowest price", uptime: 99.8 },
      { provider: "Together AI",input: 0.55, output: 1.28, latency: "980ms",  availability: "Live",    supply: "Verified", label: "Auto eligible", uptime: 99.2 },
    ],
    pricingTiers: [
      { tier: "Official model access", billing: "Pay per token", input: 0.50, output: 1.20, cacheWrite: 0.625, cacheRead: 0.10 },
    ],
    endpoints: [
      { path: "openai: /v1/chat/completions", method: "POST" },
    ],
    apiModelId: "deepseek-r1",
  },
  {
    id: "mistral-large",
    name: "Mistral/Mistral-Large",
    shortName: "Mistral-Large",
    provider: "Mistral",
    input: 0.42,
    output: 0.76,
    context: "128K",
    maxOutput: "4K",
    tags: ["Chat"],
    status: "Live",
    supply: "Verified",
    description: "Mistral Large is Mistral AI's top-tier open model. Balanced performance across chat, reasoning, and instruction following with verified supply.",
    features: ["Chat", "Tool use", "Streaming", "JSON mode"],
    releaseDate: "2024-02",
    useCases: "Enterprise chat, instruction following, summarization",
    providerRoutes: [
      { provider: "Fireworks", input: 0.42, output: 0.76, latency: "760ms",  availability: "Live",    supply: "Verified", label: "Lowest price", uptime: 99.8 },
      { provider: "Mistral",   input: 0.45, output: 0.80, latency: "880ms",  availability: "Live",    supply: "Direct",   label: "Recommended", uptime: 99.5 },
    ],
    pricingTiers: [
      { tier: "Official model access", billing: "Pay per token", input: 0.42, output: 0.76, cacheWrite: 0.525, cacheRead: 0.084 },
    ],
    endpoints: [
      { path: "openai: /v1/chat/completions", method: "POST" },
    ],
    apiModelId: "mistral-large",
  },
  {
    id: "mistral-7b",
    name: "Mistral/Mistral-7B",
    shortName: "Mistral-7B",
    provider: "Mistral",
    input: 0.04,
    output: 0.08,
    context: "32K",
    maxOutput: "4K",
    tags: ["Chat"],
    status: "Live",
    supply: "Verified",
    description: "Mistral 7B is a compact, high-throughput model. Ideal for cost-sensitive workloads that need fast, reliable chat performance.",
    features: ["Chat", "Streaming"],
    releaseDate: "2023-09",
    useCases: "High-volume chat, classification, triage",
    providerRoutes: [
      { provider: "Groq",    input: 0.04, output: 0.08, latency: "180ms",  availability: "Live",    supply: "Verified", label: "Lowest price", uptime: 99.8 },
      { provider: "Mistral", input: 0.04, output: 0.08, latency: "280ms",  availability: "Live",    supply: "Direct",   label: "Recommended", uptime: 99.5 },
    ],
    pricingTiers: [
      { tier: "Official model access", billing: "Pay per token", input: 0.04, output: 0.08, cacheWrite: 0.05, cacheRead: 0.008 },
    ],
    endpoints: [
      { path: "openai: /v1/chat/completions", method: "POST" },
    ],
    apiModelId: "mistral-7b",
  },
  {
    id: "gemma-2-27b",
    name: "Google/Gemma-2-27B",
    shortName: "Gemma-2-27B",
    provider: "Google",
    input: 0.18,
    output: 0.36,
    context: "8K",
    maxOutput: "8K",
    tags: ["Chat"],
    status: "Live",
    supply: "Verified",
    description: "Google's Gemma 2 27B is a capable open model with verified supply through OpenModels.",
    features: ["Chat", "Streaming"],
    releaseDate: "2024-06",
    useCases: "General chat, text generation",
    providerRoutes: [
      { provider: "Groq",      input: 0.18, output: 0.36, latency: "240ms",  availability: "Live",    supply: "Verified", label: "Lowest price", uptime: 99.8 },
      { provider: "Together",  input: 0.20, output: 0.40, latency: "640ms",  availability: "Live",    supply: "Verified", label: "Auto eligible", uptime: 99.2 },
    ],
    pricingTiers: [
      { tier: "Official model access", billing: "Pay per token", input: 0.18, output: 0.36, cacheWrite: 0.225, cacheRead: 0.036 },
    ],
    endpoints: [
      { path: "openai: /v1/chat/completions", method: "POST" },
    ],
    apiModelId: "gemma-2-27b",
  },
  {
    id: "phi-3-medium",
    name: "Microsoft/Phi-3-Medium",
    shortName: "Phi-3-Medium",
    provider: "Microsoft",
    input: 0.12,
    output: 0.22,
    context: "128K",
    maxOutput: "4K",
    tags: ["Chat", "Coding"],
    status: "Limited",
    supply: "Limited",
    description: "Microsoft's Phi-3 Medium is a small but capable model with strong coding performance. Currently available in limited supply.",
    features: ["Chat", "Coding", "Streaming"],
    releaseDate: "2024-04",
    useCases: "Lightweight chat, code assistance",
    providerRoutes: [
      { provider: "Azure",  input: 0.12, output: 0.22, latency: "420ms",  availability: "Limited", supply: "Limited",  label: "Limited capacity", uptime: 94.1 },
    ],
    pricingTiers: [
      { tier: "Limited access", billing: "Pay per token", input: 0.12, output: 0.22 },
    ],
    endpoints: [
      { path: "openai: /v1/chat/completions", method: "POST" },
    ],
    apiModelId: "phi-3-medium",
  },
  {
    id: "nomic-embed",
    name: "Nomic/Nomic-Embed",
    shortName: "Nomic-Embed",
    provider: "Nomic",
    input: 0.05,
    output: 0.00,
    context: "8K",
    tags: ["Embedding"],
    status: "Live",
    supply: "Verified",
    description: "Nomic Embed is a high-quality text embedding model optimized for semantic search and retrieval.",
    features: ["Streaming"],
    releaseDate: "2024-01",
    useCases: "Semantic search, RAG pipelines, clustering",
    providerRoutes: [
      { provider: "Nomic",     input: 0.05, output: 0.00, latency: "180ms",  availability: "Live",    supply: "Verified", label: "Lowest price", uptime: 99.8 },
      { provider: "Together",  input: 0.05, output: 0.00, latency: "220ms",  availability: "Live",    supply: "Verified", label: "Auto eligible", uptime: 99.2 },
    ],
    pricingTiers: [
      { tier: "Official model access", billing: "Pay per token", input: 0.05, output: 0.00 },
    ],
    endpoints: [
      { path: "openai: /v1/embeddings", method: "POST" },
    ],
    apiModelId: "nomic-embed-text",
  },
  {
    id: "mixtral-8x22b",
    name: "Mistral/Mixtral-8x22B",
    shortName: "Mixtral-8x22B",
    provider: "Mistral",
    input: 0.58,
    output: 1.18,
    context: "64K",
    maxOutput: "4K",
    tags: ["Chat", "Coding"],
    status: "Coming soon",
    supply: "Limited",
    description: "Mixtral 8x22B is a high-capacity mixture-of-experts model. Coming soon to OpenModels.",
    features: ["Chat", "Coding", "Tool use", "Streaming"],
    releaseDate: "2024-04",
    useCases: "Complex reasoning, code generation, multilingual tasks",
    providerRoutes: [],
    pricingTiers: [
      { tier: "Official model access", billing: "Pay per token", input: 0.58, output: 1.18 },
    ],
    endpoints: [
      { path: "openai: /v1/chat/completions", method: "POST" },
    ],
    apiModelId: "mixtral-8x22b",
  },
];

export function getModelById(id: string): ModelData | undefined {
  return allModels.find((m) => m.id === id);
}

export function getRelatedModels(model: ModelData, count = 3): ModelData[] {
  return allModels
    .filter((m) => m.id !== model.id && m.tags.some((t) => model.tags.includes(t)))
    .slice(0, count);
}
