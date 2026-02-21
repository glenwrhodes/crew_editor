import { Node, Edge } from 'reactflow';

export interface AgentData {
  name: string;
  role: string;
  goal: string;
  backstory: string;
  tools: string[];
  llm: string;
  allowDelegation: boolean;
  verbose: boolean;
  maxIter: number;
  maxRpm: number;
  memory: boolean;
  cacheEnabled: boolean;
  allowCodeExecution: boolean;
  maxRetryLimit: number;
}

export interface TaskData {
  name: string;
  description: string;
  expected_output: string;
  async_execution: boolean;
  human_input: boolean;
  output_file: string;
}

export interface CrewSettings {
  name: string;
  process: 'sequential' | 'hierarchical';
  memory: boolean;
  verbose: boolean;
  cache: boolean;
  maxRpm: number;
  language: string;
  managerLlm: string;
  fullOutput: boolean;
  planning: boolean;
  plannerLlm: string;
  inputs: CrewInput[];
}

export interface CrewInput {
  name: string;
  description: string;
  defaultValue: string;
}

export interface SavedGraph {
  name: string;
  nodes: Node[];
  edges: Edge[];
  graphName: string;
  crewSettings: CrewSettings;
  savedAt: string;
}

export interface SavedAgent extends AgentData {
  id: string;
}

export interface SavedTask extends TaskData {
  id: string;
}

export const DEFAULT_AGENT_DATA: AgentData = {
  name: '',
  role: '',
  goal: '',
  backstory: '',
  tools: [],
  llm: 'gpt-4o',
  allowDelegation: false,
  verbose: true,
  maxIter: 25,
  maxRpm: 0,
  memory: true,
  cacheEnabled: true,
  allowCodeExecution: false,
  maxRetryLimit: 2,
};

export const DEFAULT_TASK_DATA: TaskData = {
  name: '',
  description: '',
  expected_output: '',
  async_execution: false,
  human_input: false,
  output_file: '',
};

export const DEFAULT_CREW_SETTINGS: CrewSettings = {
  name: 'My Crew',
  process: 'sequential',
  memory: true,
  verbose: true,
  cache: true,
  maxRpm: 0,
  language: 'en',
  managerLlm: '',
  fullOutput: false,
  planning: false,
  plannerLlm: '',
  inputs: [],
};

export interface ToolInfo {
  name: string;
  description: string;
  category: string;
}

export const AVAILABLE_TOOLS: ToolInfo[] = [
  // File & Document
  { name: 'FileReadTool', description: 'Read any file type', category: 'File & Document' },
  { name: 'FileWriteTool', description: 'Write content to files', category: 'File & Document' },
  { name: 'DirectoryReadTool', description: 'List directory contents', category: 'File & Document' },
  { name: 'DirectorySearchTool', description: 'RAG search across directory contents', category: 'File & Document' },
  { name: 'CSVSearchTool', description: 'RAG search within CSV files', category: 'File & Document' },
  { name: 'DOCXSearchTool', description: 'RAG search within DOCX files', category: 'File & Document' },
  { name: 'JSONSearchTool', description: 'RAG search within JSON files', category: 'File & Document' },
  { name: 'MDXSearchTool', description: 'RAG search within MDX files', category: 'File & Document' },
  { name: 'PDFSearchTool', description: 'RAG search within PDF files', category: 'File & Document' },
  { name: 'TXTSearchTool', description: 'RAG search within text files', category: 'File & Document' },
  { name: 'XMLSearchTool', description: 'RAG search within XML files', category: 'File & Document' },

  // Web Scraping & Browsing
  { name: 'ScrapeWebsiteTool', description: 'Extract content from web pages', category: 'Web Scraping' },
  { name: 'SeleniumScrapingTool', description: 'Browser-based scraping with Selenium', category: 'Web Scraping' },
  { name: 'BrowserbaseLoadTool', description: 'Load pages via Browserbase cloud browsers', category: 'Web Scraping' },
  { name: 'FirecrawlCrawlWebsiteTool', description: 'Crawl websites recursively with Firecrawl', category: 'Web Scraping' },
  { name: 'FirecrawlScrapeWebsiteTool', description: 'Scrape single pages with Firecrawl', category: 'Web Scraping' },
  { name: 'FirecrawlSearchTool', description: 'Search the web with Firecrawl', category: 'Web Scraping' },
  { name: 'FirecrawlMapWebsiteTool', description: 'Map website structure with Firecrawl', category: 'Web Scraping' },
  { name: 'SpiderTool', description: 'High-speed web crawling and scraping', category: 'Web Scraping' },

  // Search & Research
  { name: 'SerperDevTool', description: 'Google search via Serper API', category: 'Search' },
  { name: 'EXASearchTool', description: 'Neural search with EXA API', category: 'Search' },
  { name: 'WebsiteSearchTool', description: 'RAG search on website content', category: 'Search' },
  { name: 'CodeDocsSearchTool', description: 'Search code documentation', category: 'Search' },
  { name: 'GithubSearchTool', description: 'Search GitHub repositories', category: 'Search' },
  { name: 'YoutubeVideoSearchTool', description: 'Search YouTube video transcripts', category: 'Search' },
  { name: 'YoutubeChannelSearchTool', description: 'Search YouTube channel content', category: 'Search' },

  // Database & Data
  { name: 'NL2SQLTool', description: 'Natural language to SQL query conversion', category: 'Database' },
  { name: 'PGSearchTool', description: 'RAG search on PostgreSQL databases', category: 'Database' },
  { name: 'MySQLSearchTool', description: 'RAG search on MySQL databases', category: 'Database' },
  { name: 'SnowflakeSearchTool', description: 'Query and search Snowflake data warehouses', category: 'Database' },
  { name: 'SingleStoreSearchTool', description: 'Execute queries on SingleStore', category: 'Database' },
  { name: 'QdrantVectorSearchTool', description: 'Semantic search with Qdrant vector DB', category: 'Database' },
  { name: 'WeaviateVectorSearchTool', description: 'Semantic search with Weaviate vector DB', category: 'Database' },
  { name: 'MongoDBVectorSearchTool', description: 'Vector search on MongoDB Atlas', category: 'Database' },

  // AI & Machine Learning
  { name: 'CodeInterpreterTool', description: 'Execute Python code in a sandbox', category: 'AI & ML' },
  { name: 'DallETool', description: 'Generate images with DALL-E', category: 'AI & ML' },
  { name: 'VisionTool', description: 'Extract text and info from images', category: 'AI & ML' },
  { name: 'RagTool', description: 'RAG-based document Q&A', category: 'AI & ML' },
  { name: 'AIMindTool', description: 'Query data sources in natural language', category: 'AI & ML' },
  { name: 'LangChainTool', description: 'Wrap LangChain tools for use in CrewAI', category: 'AI & ML' },
  { name: 'LlamaIndexTool', description: 'Wrap LlamaIndex tools and query engines', category: 'AI & ML' },

  // Cloud & Storage
  { name: 'S3ReaderTool', description: 'Read files from AWS S3 buckets', category: 'Cloud' },
  { name: 'S3WriterTool', description: 'Write files to AWS S3 buckets', category: 'Cloud' },
  { name: 'BedrockKBRetrieverTool', description: 'Query Amazon Bedrock Knowledge Bases', category: 'Cloud' },

  // Automation & Integration
  { name: 'ComposioTool', description: '250+ integrations via Composio', category: 'Automation' },
  { name: 'ApifyActorsTool', description: 'Run Apify Actors for web automation', category: 'Automation' },
  { name: 'MultiOnTool', description: 'Web browsing via natural language', category: 'Automation' },
  { name: 'ZapierActionsTool', description: 'Trigger Zapier actions and workflows', category: 'Automation' },
];

export interface LLMInfo {
  value: string;
  label: string;
  provider: string;
}

export const AVAILABLE_LLMS: LLMInfo[] = [
  // OpenAI
  { value: 'gpt-4o', label: 'GPT-4o', provider: 'OpenAI' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini', provider: 'OpenAI' },
  { value: 'gpt-4.1', label: 'GPT-4.1', provider: 'OpenAI' },
  { value: 'gpt-4.1-mini', label: 'GPT-4.1 Mini', provider: 'OpenAI' },
  { value: 'gpt-4.1-nano', label: 'GPT-4.1 Nano', provider: 'OpenAI' },
  { value: 'gpt-5', label: 'GPT-5', provider: 'OpenAI' },
  { value: 'gpt-5.1', label: 'GPT-5.1', provider: 'OpenAI' },
  { value: 'gpt-5.2', label: 'GPT-5.2', provider: 'OpenAI' },
  { value: 'gpt-5.3', label: 'GPT-5.3', provider: 'OpenAI' },
  { value: 'o1', label: 'o1', provider: 'OpenAI' },
  { value: 'o3', label: 'o3', provider: 'OpenAI' },
  { value: 'o3-mini', label: 'o3 Mini', provider: 'OpenAI' },
  { value: 'o4-mini', label: 'o4 Mini', provider: 'OpenAI' },

  // OpenAI Codex
  { value: 'openai/gpt-5.1-codex', label: 'GPT-5.1 Codex', provider: 'OpenAI Codex' },
  { value: 'openai/gpt-5.2-codex', label: 'GPT-5.2 Codex', provider: 'OpenAI Codex' },
  { value: 'openai/gpt-5.3-codex', label: 'GPT-5.3 Codex', provider: 'OpenAI Codex' },

  // Anthropic
  { value: 'anthropic/claude-3.5-haiku', label: 'Claude 3.5 Haiku', provider: 'Anthropic' },
  { value: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { value: 'anthropic/claude-3.7-sonnet', label: 'Claude 3.7 Sonnet', provider: 'Anthropic' },
  { value: 'anthropic/claude-haiku-4', label: 'Claude Haiku 4', provider: 'Anthropic' },
  { value: 'anthropic/claude-sonnet-4', label: 'Claude Sonnet 4', provider: 'Anthropic' },
  { value: 'anthropic/claude-sonnet-4.5', label: 'Claude Sonnet 4.5', provider: 'Anthropic' },
  { value: 'anthropic/claude-sonnet-4.6', label: 'Claude Sonnet 4.6', provider: 'Anthropic' },
  { value: 'anthropic/claude-opus-4', label: 'Claude Opus 4', provider: 'Anthropic' },
  { value: 'anthropic/claude-opus-4.5', label: 'Claude Opus 4.5', provider: 'Anthropic' },
  { value: 'anthropic/claude-opus-4.6', label: 'Claude Opus 4.6', provider: 'Anthropic' },

  // Google Gemini
  { value: 'gemini/gemini-2.0-flash', label: 'Gemini 2.0 Flash', provider: 'Google' },
  { value: 'gemini/gemini-2.5-flash', label: 'Gemini 2.5 Flash', provider: 'Google' },
  { value: 'gemini/gemini-2.5-pro', label: 'Gemini 2.5 Pro', provider: 'Google' },
  { value: 'gemini/gemini-3-flash', label: 'Gemini 3 Flash', provider: 'Google' },
  { value: 'gemini/gemini-3-pro', label: 'Gemini 3 Pro', provider: 'Google' },

  // xAI
  { value: 'xai/grok-3', label: 'Grok 3', provider: 'xAI' },
  { value: 'xai/grok-3-fast', label: 'Grok 3 Fast', provider: 'xAI' },
  { value: 'xai/grok-3-mini', label: 'Grok 3 Mini', provider: 'xAI' },
  { value: 'xai/grok-4', label: 'Grok 4', provider: 'xAI' },
  { value: 'xai/grok-4-fast', label: 'Grok 4 Fast', provider: 'xAI' },
  { value: 'xai/grok-code-fast', label: 'Grok Code Fast', provider: 'xAI' },

  // Mistral
  { value: 'mistral/mistral-large-latest', label: 'Mistral Large', provider: 'Mistral' },
  { value: 'mistral/mistral-medium-latest', label: 'Mistral Medium', provider: 'Mistral' },
  { value: 'mistral/mistral-small-latest', label: 'Mistral Small', provider: 'Mistral' },
  { value: 'mistral/codestral-latest', label: 'Codestral', provider: 'Mistral' },
  { value: 'mistral/devstral-latest', label: 'Devstral', provider: 'Mistral' },
  { value: 'mistral/ministral-8b-latest', label: 'Ministral 8B', provider: 'Mistral' },
  { value: 'mistral/pixtral-large-latest', label: 'Pixtral Large', provider: 'Mistral' },

  // Groq (fast inference)
  { value: 'groq/llama-3.3-70b-versatile', label: 'Llama 3.3 70B', provider: 'Groq' },
  { value: 'groq/llama-3.1-8b-instant', label: 'Llama 3.1 8B', provider: 'Groq' },
  { value: 'groq/deepseek-r1-distill-llama-70b', label: 'DeepSeek R1 70B', provider: 'Groq' },
  { value: 'groq/qwen-qwq-32b', label: 'Qwen QwQ 32B', provider: 'Groq' },
  { value: 'groq/kimi-k2', label: 'Kimi K2', provider: 'Groq' },

  // OpenRouter (100+ models via one key)
  { value: 'openrouter/auto', label: 'Auto (best match)', provider: 'OpenRouter' },
  { value: 'openrouter/openai/gpt-5', label: 'GPT-5 via Router', provider: 'OpenRouter' },
  { value: 'openrouter/anthropic/claude-sonnet-4', label: 'Claude Sonnet 4 via Router', provider: 'OpenRouter' },
  { value: 'openrouter/google/gemini-2.5-pro', label: 'Gemini 2.5 Pro via Router', provider: 'OpenRouter' },
  { value: 'openrouter/meta-llama/llama-3.3-70b', label: 'Llama 3.3 70B via Router', provider: 'OpenRouter' },
];

export function migrateNodeData(node: Node): Node {
  if (node.type === 'agent') {
    const data = node.data as Record<string, unknown>;
    return {
      ...node,
      data: {
        ...DEFAULT_AGENT_DATA,
        ...data,
        tools: typeof data.tools === 'string'
          ? (data.tools as string).split(',').map((t: string) => t.trim()).filter(Boolean)
          : (data.tools || []),
        onChange: undefined,
      },
    };
  }
  if (node.type === 'task') {
    const data = node.data as Record<string, unknown>;
    return {
      ...node,
      data: {
        ...DEFAULT_TASK_DATA,
        ...data,
        onChange: undefined,
      },
    };
  }
  return node;
}
