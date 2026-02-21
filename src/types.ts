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
};

export interface ToolInfo {
  name: string;
  description: string;
  category: string;
}

export const AVAILABLE_TOOLS: ToolInfo[] = [
  { name: 'SerperDevTool', description: 'Web search via Serper API', category: 'Search' },
  { name: 'ScrapeWebsiteTool', description: 'Scrape website content', category: 'Web' },
  { name: 'FileReadTool', description: 'Read file contents', category: 'File' },
  { name: 'FileWriteTool', description: 'Write to files', category: 'File' },
  { name: 'DirectoryReadTool', description: 'List directory contents', category: 'File' },
  { name: 'DirectorySearchTool', description: 'Search across directories', category: 'File' },
  { name: 'CodeDocsSearchTool', description: 'Search code documentation', category: 'Search' },
  { name: 'CodeInterpreterTool', description: 'Execute Python code', category: 'Code' },
  { name: 'MDXSearchTool', description: 'Search MDX documents', category: 'Search' },
  { name: 'PDFSearchTool', description: 'Search PDF documents', category: 'Search' },
  { name: 'TXTSearchTool', description: 'Search text files', category: 'Search' },
  { name: 'CSVSearchTool', description: 'Search CSV files', category: 'Search' },
  { name: 'JSONSearchTool', description: 'Search JSON files', category: 'Search' },
  { name: 'XMLSearchTool', description: 'Search XML files', category: 'Search' },
  { name: 'DOCXSearchTool', description: 'Search DOCX files', category: 'Search' },
  { name: 'YoutubeVideoSearchTool', description: 'Search YouTube videos', category: 'Search' },
  { name: 'YoutubeChannelSearchTool', description: 'Search YouTube channels', category: 'Search' },
  { name: 'GithubSearchTool', description: 'Search GitHub repos', category: 'Search' },
  { name: 'WebsiteSearchTool', description: 'RAG search on websites', category: 'Search' },
  { name: 'DallETool', description: 'Generate images with DALL-E', category: 'AI' },
  { name: 'VisionTool', description: 'Analyze images with vision', category: 'AI' },
  { name: 'EXASearchTool', description: 'Neural search with EXA', category: 'Search' },
  { name: 'RagTool', description: 'RAG-based document search', category: 'Search' },
  { name: 'BrowserbaseLoadTool', description: 'Load webpages via Browserbase', category: 'Web' },
  { name: 'ComposioTool', description: 'Composio integrations', category: 'Integration' },
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
  { value: 'anthropic/claude-opus-4', label: 'Claude Opus 4', provider: 'Anthropic' },

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
