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
  { value: 'gpt-4o', label: 'GPT-4o', provider: 'OpenAI' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini', provider: 'OpenAI' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', provider: 'OpenAI' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', provider: 'OpenAI' },
  { value: 'o1', label: 'o1', provider: 'OpenAI' },
  { value: 'o1-mini', label: 'o1 Mini', provider: 'OpenAI' },
  { value: 'o3-mini', label: 'o3 Mini', provider: 'OpenAI' },
  { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus', provider: 'Anthropic' },
  { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet', provider: 'Anthropic' },
  { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku', provider: 'Anthropic' },
  { value: 'gemini/gemini-1.5-pro', label: 'Gemini 1.5 Pro', provider: 'Google' },
  { value: 'gemini/gemini-1.5-flash', label: 'Gemini 1.5 Flash', provider: 'Google' },
  { value: 'gemini/gemini-pro', label: 'Gemini Pro', provider: 'Google' },
  { value: 'groq/llama-3.1-70b-versatile', label: 'Llama 3.1 70B', provider: 'Groq' },
  { value: 'groq/llama-3.1-8b-instant', label: 'Llama 3.1 8B', provider: 'Groq' },
  { value: 'groq/mixtral-8x7b-32768', label: 'Mixtral 8x7B', provider: 'Groq' },
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
