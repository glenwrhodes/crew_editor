import { Node, Edge, MarkerType } from 'reactflow';
import { AgentData, TaskData, CrewSettings, DEFAULT_AGENT_DATA, DEFAULT_TASK_DATA, DEFAULT_CREW_SETTINGS } from '../types';
import { COLORS } from '../theme';
import { v4 as uuidv4 } from 'uuid';

export interface CrewTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  accentColor: string;
  agentCount: number;
  taskCount: number;
  tags: string[];
  build: () => { nodes: Node[]; edges: Edge[]; crewSettings: CrewSettings };
}

function id() { return `node_${uuidv4()}`; }

function agentNode(nid: string, x: number, y: number, data: Partial<AgentData>): Node {
  return { id: nid, type: 'agent', position: { x, y }, data: { ...DEFAULT_AGENT_DATA, ...data } };
}

function taskNode(nid: string, x: number, y: number, data: Partial<TaskData>): Node {
  return { id: nid, type: 'task', position: { x, y }, data: { ...DEFAULT_TASK_DATA, ...data } };
}

function beginNode(nid: string, x: number, y: number): Node {
  return { id: nid, type: 'begin', position: { x, y }, data: {} };
}

function execEdge(sourceId: string, targetId: string): Edge {
  return {
    id: id(), source: sourceId, target: targetId,
    sourceHandle: 'exec-out', targetHandle: 'exec-in',
    type: 'default', animated: true,
    style: { strokeDasharray: '6,4', stroke: COLORS.text.muted, strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: COLORS.text.muted, width: 16, height: 16 },
  };
}

function agentEdge(agentId: string, taskId: string): Edge {
  return {
    id: id(), source: agentId, target: taskId,
    sourceHandle: 'agent-out', targetHandle: 'agent',
    type: 'default', animated: false,
    style: { stroke: COLORS.agent.primary, strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: COLORS.agent.primary, width: 16, height: 16 },
  };
}

// ─── Template 1: Research & Analysis Team ───────────────────────────────────

function buildResearchTeam() {
  const begin = id(), a1 = id(), a2 = id(), a3 = id(), t1 = id(), t2 = id(), t3 = id();

  const nodes: Node[] = [
    beginNode(begin, 50, 260),

    agentNode(a1, 300, 30, {
      name: 'Senior_Researcher',
      role: 'Senior Research Analyst',
      goal: 'Conduct thorough, multi-source research and uncover comprehensive insights on {topic}',
      backstory: 'You are a seasoned research analyst with 15 years of experience across technology, business, and science domains. You are known for your meticulous attention to detail and your ability to find information that others miss. You cross-reference multiple authoritative sources and always verify claims before including them in your work.',
      tools: ['SerperDevTool', 'ScrapeWebsiteTool', 'WebsiteSearchTool'],
      llm: 'gpt-4o',
      verbose: true,
      memory: true,
    }),
    agentNode(a2, 620, 30, {
      name: 'Data_Analyst',
      role: 'Data Analyst & Pattern Recognition Specialist',
      goal: 'Analyze research data to identify trends, patterns, and actionable insights that support strategic decisions',
      backstory: 'With a background in data science and statistics, you excel at finding meaningful patterns in both qualitative and quantitative data. You have worked with Fortune 500 companies and startups alike, providing data-driven insights that shaped critical business decisions. You are particularly skilled at cross-referencing multiple data sources to validate findings.',
      tools: ['FileReadTool', 'CSVSearchTool'],
      llm: 'gpt-4o',
      verbose: true,
      memory: true,
    }),
    agentNode(a3, 940, 30, {
      name: 'Report_Writer',
      role: 'Technical Report Writer',
      goal: 'Create comprehensive, well-structured reports that communicate research findings clearly and persuasively to executive stakeholders',
      backstory: 'You are an award-winning technical writer who has authored hundreds of research reports, white papers, and executive briefings. You have a gift for translating complex findings into clear, compelling narratives. You understand how to structure information for maximum impact and always include actionable recommendations.',
      tools: ['FileWriteTool'],
      llm: 'anthropic/claude-sonnet-4',
      verbose: true,
      memory: true,
    }),

    taskNode(t1, 300, 260, {
      name: 'conduct_research',
      description: 'Conduct comprehensive research on {topic}. Gather information from multiple authoritative sources including academic papers, industry reports, news articles, and expert opinions. Focus on recent developments within the last 12 months, key statistics, and diverse perspectives. Verify all facts against at least two independent sources.',
      expected_output: 'A detailed research brief with: key findings organized by theme, supporting data and statistics, source citations for every claim, a summary of different perspectives, and identification of any knowledge gaps or conflicting information.',
    }),
    taskNode(t2, 620, 260, {
      name: 'analyze_findings',
      description: 'Analyze the research findings to identify the most significant trends, patterns, and insights. Cross-reference data points to validate accuracy. Identify areas of consensus and disagreement among sources. Quantify findings where possible and highlight any surprising or counter-intuitive discoveries.',
      expected_output: 'A structured analytical summary with: top 5 key trends with supporting evidence, pattern analysis across sources, risk factors and opportunities identified, data-supported predictions, and prioritized recommendations for action.',
    }),
    taskNode(t3, 940, 260, {
      name: 'write_final_report',
      description: 'Compile all research and analysis on {topic} into a polished, comprehensive report. Structure it with an executive summary, methodology overview, detailed findings organized by theme, analysis section, conclusions, and actionable recommendations. Use clear headings, bullet points for key takeaways, and ensure the tone is professional yet engaging.',
      expected_output: 'A publication-ready research report in markdown format with: executive summary (1 page), methodology, detailed findings (organized by theme), analysis and insights, conclusions, and 5-10 actionable recommendations with priority levels.',
      output_file: 'research_report.md',
    }),
  ];

  const edges: Edge[] = [
    execEdge(begin, t1), execEdge(t1, t2), execEdge(t2, t3),
    agentEdge(a1, t1), agentEdge(a2, t2), agentEdge(a3, t3),
  ];

  const crewSettings: CrewSettings = {
    ...DEFAULT_CREW_SETTINGS,
    name: 'Research & Analysis Team',
    process: 'sequential',
    memory: true,
    verbose: true,
    inputs: [
      { name: 'topic', description: 'The topic to research', defaultValue: 'AI agents in enterprise automation' },
    ],
  };

  return { nodes, edges, crewSettings };
}

// ─── Template 2: Content Production Pipeline ────────────────────────────────

function buildContentPipeline() {
  const begin = id(), a1 = id(), a2 = id(), a3 = id(), a4 = id();
  const t1 = id(), t2 = id(), t3 = id(), t4 = id();

  const nodes: Node[] = [
    beginNode(begin, 50, 260),

    agentNode(a1, 300, 20, {
      name: 'Content_Strategist',
      role: 'Senior Content Strategist',
      goal: 'Develop data-driven content strategies for {target_audience} that maximize audience engagement on {topic}',
      backstory: 'You are a veteran content strategist with over a decade of experience in digital media. You have led content teams at top publications and tech companies, consistently growing audiences by 300%+. You deeply understand SEO, audience psychology, and content-market fit. You always back your content plans with competitive research and audience data.',
      tools: ['SerperDevTool', 'WebsiteSearchTool'],
      llm: 'anthropic/claude-sonnet-4',
      verbose: true,
      memory: true,
    }),
    agentNode(a2, 610, 20, {
      name: 'Content_Writer',
      role: 'Senior Content Writer',
      goal: 'Produce high-quality, engaging content about {topic} that resonates with {target_audience} and drives measurable results',
      backstory: 'You are a versatile writer whose work has been featured in major publications and driven millions of pageviews. You adapt your tone and style effortlessly to match any brand voice while maintaining authenticity. You write with clarity, personality, and purpose — every paragraph serves a goal. You excel at long-form articles, blog posts, and thought leadership pieces.',
      tools: ['SerperDevTool', 'WebsiteSearchTool'],
      llm: 'anthropic/claude-sonnet-4',
      verbose: true,
      memory: true,
    }),
    agentNode(a3, 920, 20, {
      name: 'Editor',
      role: 'Senior Editor & Fact-Checker',
      goal: 'Ensure all content meets the highest standards of quality, accuracy, and brand consistency',
      backstory: 'You are a meticulous editor with experience at major publishing houses and digital media companies. You have an eagle eye for grammar, inconsistencies, and logical gaps. You elevate good writing to great writing while preserving the author\'s voice. You always fact-check claims and flag unsubstantiated assertions.',
      tools: ['SerperDevTool'],
      llm: 'anthropic/claude-sonnet-4',
      verbose: true,
      memory: true,
    }),
    agentNode(a4, 1230, 20, {
      name: 'SEO_Specialist',
      role: 'SEO & Content Optimization Specialist',
      goal: 'Optimize content for search engines and discoverability while maintaining quality and readability',
      backstory: 'You are an SEO expert who has helped hundreds of articles rank on page one of Google. You understand the evolving landscape of search algorithms and know how to balance technical SEO with content quality. You optimize strategically — never stuffing keywords at the expense of reader experience. You also understand social sharing signals and content distribution.',
      tools: ['SerperDevTool', 'ScrapeWebsiteTool'],
      llm: 'gpt-4o',
      verbose: true,
      memory: true,
    }),

    taskNode(t1, 300, 260, {
      name: 'plan_content_strategy',
      description: 'Research {topic} and the {target_audience} audience to develop a comprehensive content plan. Analyze top-performing competitor content on this topic. Identify content gaps and unique angles. Define the target audience persona, desired tone, key messages, and optimal content structure. Include keyword opportunities and suggested headlines.',
      expected_output: 'A content strategy brief with: target audience persona, 3 headline options, recommended article structure/outline, key messages and talking points, competitive analysis summary, target keywords (primary + secondary), and estimated word count.',
    }),
    taskNode(t2, 610, 260, {
      name: 'write_content',
      description: 'Write a compelling, well-researched article about {topic} based on the content strategy. Follow the recommended structure and incorporate the key messages. Use an engaging hook, clear subheadings, and a strong conclusion with a call to action. Include relevant examples, data points, and expert insights. Target the specified word count and maintain consistent tone throughout.',
      expected_output: 'A complete article draft in markdown format with: engaging headline, compelling introduction with hook, well-structured body with subheadings, relevant examples and data, clear conclusion with call to action, and suggested meta description.',
    }),
    taskNode(t3, 920, 260, {
      name: 'edit_and_polish',
      description: 'Thoroughly edit the draft for grammar, spelling, punctuation, and style consistency. Check all factual claims and flag any that cannot be verified. Improve sentence flow and readability. Ensure the article maintains a consistent voice and meets professional publication standards. Suggest improvements to strengthen weak sections.',
      expected_output: 'A polished, publication-ready article with: all grammar and spelling errors corrected, improved sentence flow and readability, fact-check annotations, style consistency throughout, and a brief editor\'s note highlighting key changes made.',
    }),
    taskNode(t4, 1230, 260, {
      name: 'optimize_for_seo',
      description: 'Optimize the edited article for search engines. Review and refine the headline for click-through rate. Ensure primary and secondary keywords are naturally integrated. Optimize meta description, heading hierarchy (H1/H2/H3), and internal linking opportunities. Add alt text suggestions for any images. Check readability score and suggest improvements.',
      expected_output: 'The fully optimized article with: SEO-optimized headline and meta description, keyword placement audit, heading hierarchy review, internal/external linking suggestions, image alt text recommendations, readability score, and a brief SEO checklist showing all optimizations made.',
      output_file: 'final_article.md',
    }),
  ];

  const edges: Edge[] = [
    execEdge(begin, t1), execEdge(t1, t2), execEdge(t2, t3), execEdge(t3, t4),
    agentEdge(a1, t1), agentEdge(a2, t2), agentEdge(a3, t3), agentEdge(a4, t4),
  ];

  const crewSettings: CrewSettings = {
    ...DEFAULT_CREW_SETTINGS,
    name: 'Content Production Pipeline',
    process: 'sequential',
    memory: true,
    verbose: true,
    inputs: [
      { name: 'topic', description: 'The subject of the content piece', defaultValue: 'The future of remote work in 2026' },
      { name: 'target_audience', description: 'Who the content is written for', defaultValue: 'tech professionals and startup founders' },
    ],
  };

  return { nodes, edges, crewSettings };
}

// ─── Template 3: Marketing Campaign Team ────────────────────────────────────

function buildMarketingCampaign() {
  const begin = id(), a1 = id(), a2 = id(), a3 = id(), a4 = id();
  const t1 = id(), t2 = id(), t3 = id(), t4 = id();

  const nodes: Node[] = [
    beginNode(begin, 50, 260),

    agentNode(a1, 300, 20, {
      name: 'Market_Researcher',
      role: 'Market Research & Competitive Intelligence Analyst',
      goal: 'Uncover deep market insights about {product} for {target_audience}, analyzing audience behaviors and competitive dynamics',
      backstory: 'You are a market research specialist with 12 years of experience analyzing consumer behavior and competitive landscapes. You have conducted research for brands like Nike, Airbnb, and Stripe. You combine quantitative data analysis with qualitative insight gathering to paint a complete picture of any market. Your research has directly contributed to campaigns that generated over $100M in revenue.',
      tools: ['SerperDevTool', 'ScrapeWebsiteTool', 'WebsiteSearchTool'],
      llm: 'gpt-4o',
      verbose: true,
      memory: true,
    }),
    agentNode(a2, 610, 20, {
      name: 'Creative_Director',
      role: 'Creative Director & Campaign Strategist',
      goal: 'Develop innovative, memorable campaign concepts for {product} that cut through the noise and drive measurable results',
      backstory: 'You are a Creative Director with 15 years in advertising and brand strategy. You have led award-winning campaigns at agencies and in-house teams, winning multiple Cannes Lions and Effie Awards. You think in big ideas but always ground creativity in strategy. You understand that great campaigns balance emotional resonance with clear business objectives.',
      tools: ['SerperDevTool'],
      llm: 'anthropic/claude-sonnet-4',
      verbose: true,
      memory: true,
    }),
    agentNode(a3, 920, 20, {
      name: 'Copywriter',
      role: 'Senior Marketing Copywriter',
      goal: 'Craft persuasive marketing copy for {product} targeting {target_audience} that converts across all channels',
      backstory: 'You are a direct-response copywriter with a talent for brand storytelling. You have written copy for product launches, email campaigns, landing pages, social media, and ad creatives that have generated millions in conversions. You understand persuasion psychology and know how to adapt your voice for different channels while maintaining brand consistency. Every word you write has a purpose.',
      tools: [],
      llm: 'anthropic/claude-sonnet-4',
      verbose: true,
      memory: true,
    }),
    agentNode(a4, 1230, 20, {
      name: 'Campaign_Analyst',
      role: 'Campaign Performance & Analytics Strategist',
      goal: 'Design comprehensive measurement frameworks that prove ROI and provide actionable optimization insights',
      backstory: 'You are a marketing analytics expert who has built measurement frameworks for enterprise campaigns across digital, social, email, and traditional channels. You think in terms of funnels, attribution models, and incrementality. You translate complex data into clear dashboards and recommendations that marketing teams can act on immediately.',
      tools: ['FileWriteTool'],
      llm: 'gpt-4o',
      verbose: true,
      memory: true,
    }),

    taskNode(t1, 300, 260, {
      name: 'market_analysis',
      description: 'Conduct thorough market and competitive analysis for {product}. Research {target_audience} demographics, psychographics, and behaviors. Analyze competitor campaigns — what worked, what didn\'t, and why. Identify market trends, seasonal opportunities, and whitespace. Summarize audience pain points and motivations that the campaign should address.',
      expected_output: 'A market analysis report with: target audience personas (2-3), competitive landscape overview with SWOT, market trends and opportunities, audience pain points and motivations, channel preferences of the target audience, and 3-5 strategic insights to guide the campaign.',
    }),
    taskNode(t2, 610, 260, {
      name: 'campaign_strategy',
      description: 'Develop a comprehensive campaign strategy for {product} based on the market research. Define the campaign concept/big idea, core messaging framework, channel strategy, content pillars, and timeline. Ensure the strategy addresses {target_audience} pain points, differentiates from competitors, and has a clear path to conversion. Include both brand awareness and performance marketing elements.',
      expected_output: 'A complete campaign strategy document with: campaign concept/big idea, messaging hierarchy (headline, subheads, proof points), channel mix and rationale, content calendar overview, target KPIs by channel, budget allocation recommendations, and risk mitigation strategies.',
    }),
    taskNode(t3, 920, 260, {
      name: 'create_campaign_copy',
      description: 'Write all campaign copy assets based on the creative strategy. Create: 1) Hero headline and tagline variations, 2) Landing page copy, 3) Email sequence (3 emails: awareness, consideration, conversion), 4) Social media posts (5 posts each for LinkedIn, Twitter/X, and Instagram), 5) Ad copy (3 variations each for search and display). Maintain consistent voice and messaging across all assets.',
      expected_output: 'A complete copy deck with all campaign assets organized by channel: hero headlines (5 options), landing page copy, 3-email nurture sequence, 15 social media posts, 6 ad copy variations, and a brand voice/tone guide for the campaign.',
      output_file: 'campaign_copy_deck.md',
    }),
    taskNode(t4, 1230, 260, {
      name: 'measurement_framework',
      description: 'Design a comprehensive measurement and analytics plan for the campaign. Define KPIs for each channel and funnel stage. Create an attribution model recommendation. Specify tracking requirements (UTM parameters, pixels, events). Design a reporting dashboard structure. Include benchmarks for success and a testing/optimization roadmap with A/B test hypotheses.',
      expected_output: 'A measurement framework document with: KPI definitions by channel and funnel stage, attribution model recommendation, tracking implementation checklist, dashboard wireframe/structure, success benchmarks and targets, A/B testing roadmap (5 test hypotheses), and a weekly/monthly reporting cadence.',
      output_file: 'measurement_framework.md',
    }),
  ];

  const edges: Edge[] = [
    execEdge(begin, t1), execEdge(t1, t2), execEdge(t2, t3), execEdge(t3, t4),
    agentEdge(a1, t1), agentEdge(a2, t2), agentEdge(a3, t3), agentEdge(a4, t4),
  ];

  const crewSettings: CrewSettings = {
    ...DEFAULT_CREW_SETTINGS,
    name: 'Marketing Campaign Team',
    process: 'sequential',
    memory: true,
    verbose: true,
    inputs: [
      { name: 'product', description: 'The product or service to market', defaultValue: 'AI-powered project management tool' },
      { name: 'target_audience', description: 'The target market segment', defaultValue: 'mid-market SaaS companies with 50-500 employees' },
    ],
  };

  return { nodes, edges, crewSettings };
}

// ─── Template 4: Software Development Team ──────────────────────────────────

function buildSoftwareDevTeam() {
  const begin = id(), a1 = id(), a2 = id(), a3 = id(), a4 = id();
  const t1 = id(), t2 = id(), t3 = id(), t4 = id();

  const nodes: Node[] = [
    beginNode(begin, 50, 260),

    agentNode(a1, 300, 20, {
      name: 'Product_Manager',
      role: 'Senior Product Manager & Requirements Analyst',
      goal: 'Define clear, comprehensive product requirements for {project_brief} using {tech_stack}, enabling the team to build the right solution efficiently',
      backstory: 'You are a product manager with 10 years of experience shipping software products at startups and enterprise companies. You excel at translating business needs into technical requirements. You think in terms of user outcomes, edge cases, and acceptance criteria. You have a strong technical background that helps you communicate effectively with engineering teams and anticipate implementation challenges.',
      tools: ['SerperDevTool', 'FileWriteTool'],
      llm: 'anthropic/claude-sonnet-4',
      verbose: true,
      memory: true,
    }),
    agentNode(a2, 610, 20, {
      name: 'Senior_Developer',
      role: 'Senior Software Engineer',
      goal: 'Design and implement a clean, efficient solution for {project_brief} in {tech_stack} that meets requirements and follows best practices',
      backstory: 'You are a senior software engineer with 12 years of experience across backend, frontend, and infrastructure. You have contributed to open-source projects and led architecture decisions at high-scale companies. You write code that is clean, well-documented, and maintainable. You follow SOLID principles, write comprehensive tests, and always consider performance, security, and scalability in your implementations.',
      tools: ['CodeInterpreterTool', 'FileReadTool', 'FileWriteTool', 'CodeDocsSearchTool'],
      llm: 'anthropic/claude-sonnet-4',
      verbose: true,
      memory: true,
      allowCodeExecution: true,
    }),
    agentNode(a3, 920, 20, {
      name: 'Code_Reviewer',
      role: 'Staff Engineer & Code Quality Advocate',
      goal: 'Ensure code quality, security, and adherence to best practices through thorough, constructive code review',
      backstory: 'You are a staff engineer with deep expertise in software design patterns, security best practices, and code quality. You have reviewed thousands of pull requests and mentored dozens of developers. Your reviews are thorough but constructive — you explain the "why" behind every suggestion. You catch bugs, security vulnerabilities, and performance issues that others miss.',
      tools: ['CodeDocsSearchTool', 'FileReadTool'],
      llm: 'anthropic/claude-opus-4',
      verbose: true,
      memory: true,
    }),
    agentNode(a4, 1230, 20, {
      name: 'QA_Engineer',
      role: 'Senior QA Engineer & Test Automation Specialist',
      goal: 'Validate functionality, identify edge cases, and ensure the software meets quality standards through comprehensive testing',
      backstory: 'You are a QA engineer with expertise in both manual and automated testing. You think like a user but test like an adversary — always looking for ways to break the software. You have experience with unit testing, integration testing, E2E testing, and performance testing. You write clear, reproducible bug reports and create test plans that cover happy paths, edge cases, and failure modes.',
      tools: ['CodeInterpreterTool', 'FileReadTool', 'FileWriteTool'],
      llm: 'gpt-4o',
      verbose: true,
      memory: true,
    }),

    taskNode(t1, 300, 260, {
      name: 'define_requirements',
      description: 'Analyze the following project brief: {project_brief}. The tech stack is {tech_stack}. Create detailed technical requirements. Break the work into user stories with clear acceptance criteria. Define the data model, API contracts, and system architecture at a high level. Identify technical risks, dependencies, and assumptions. Prioritize features using MoSCoW (Must/Should/Could/Won\'t) and estimate complexity for each user story.',
      expected_output: 'A product requirements document (PRD) with: problem statement, user stories with acceptance criteria, data model diagram description, API endpoint specifications, architecture overview, technical risks and mitigations, MoSCoW prioritization, and complexity estimates.',
      output_file: 'requirements.md',
    }),
    taskNode(t2, 610, 260, {
      name: 'implement_solution',
      description: 'Implement the solution using {tech_stack} based on the requirements document. Write clean, well-structured code following language best practices and SOLID principles. Include comprehensive docstrings and inline comments for complex logic. Write unit tests for all business logic with >80% coverage target. Handle error cases gracefully. Consider performance and security throughout.',
      expected_output: 'Complete implementation code with: well-structured source code, unit tests with good coverage, clear documentation and docstrings, error handling for edge cases, and a brief implementation notes document explaining key design decisions.',
      output_file: 'implementation.md',
    }),
    taskNode(t3, 920, 260, {
      name: 'review_code',
      description: 'Perform a thorough code review of the implementation. Check for: correctness against requirements, code quality and readability, security vulnerabilities (injection, auth issues, data leaks), performance concerns (N+1 queries, memory leaks, unnecessary computation), test coverage gaps, error handling completeness, and adherence to best practices. Provide specific, actionable feedback with code examples where helpful.',
      expected_output: 'A detailed code review report with: summary of findings (critical/major/minor), specific issues with line references and suggested fixes, security audit results, performance assessment, test coverage analysis, architecture/design feedback, and an overall approval status (Approve/Request Changes).',
      output_file: 'code_review.md',
    }),
    taskNode(t4, 1230, 260, {
      name: 'test_and_validate',
      description: 'Create and execute a comprehensive test plan. Write integration tests and E2E test scenarios. Test all user stories against their acceptance criteria. Verify edge cases, error handling, and boundary conditions. Perform basic security testing (input validation, auth flows). Document all bugs found with steps to reproduce, expected vs actual behavior, and severity rating.',
      expected_output: 'A QA report with: test plan overview, test case results (pass/fail) for all user stories, integration test results, list of bugs found (with severity, repro steps, and screenshots/logs), edge case coverage summary, security test results, and a go/no-go recommendation with justification.',
      output_file: 'qa_report.md',
    }),
  ];

  const edges: Edge[] = [
    execEdge(begin, t1), execEdge(t1, t2), execEdge(t2, t3), execEdge(t3, t4),
    agentEdge(a1, t1), agentEdge(a2, t2), agentEdge(a3, t3), agentEdge(a4, t4),
  ];

  const crewSettings: CrewSettings = {
    ...DEFAULT_CREW_SETTINGS,
    name: 'Software Development Team',
    process: 'sequential',
    memory: true,
    verbose: true,
    cache: true,
    inputs: [
      { name: 'project_brief', description: 'Description of what to build', defaultValue: 'A REST API for a task management app with user auth, projects, and task CRUD' },
      { name: 'tech_stack', description: 'Technologies to use', defaultValue: 'Python with FastAPI, PostgreSQL, and SQLAlchemy' },
    ],
  };

  return { nodes, edges, crewSettings };
}

// ─── Exported Template Registry ─────────────────────────────────────────────

export const CREW_TEMPLATES: CrewTemplate[] = [
  {
    id: 'research',
    name: 'Research & Analysis',
    description: 'A team that researches any topic in depth, analyzes the findings for patterns and insights, and produces a polished executive report.',
    icon: '🔍',
    accentColor: '#3B82F6',
    agentCount: 3,
    taskCount: 3,
    tags: ['Research', 'Analysis', 'Reports'],
    build: buildResearchTeam,
  },
  {
    id: 'content',
    name: 'Content Production',
    description: 'An end-to-end content pipeline: strategy and planning, writing, editorial polish, and SEO optimization. Goes from topic to published article.',
    icon: '✍️',
    accentColor: '#10B981',
    agentCount: 4,
    taskCount: 4,
    tags: ['Content', 'Writing', 'SEO'],
    build: buildContentPipeline,
  },
  {
    id: 'marketing',
    name: 'Marketing Campaign',
    description: 'Launch a full marketing campaign: market research and competitive analysis, creative strategy, multi-channel copy, and a measurement framework.',
    icon: '📢',
    accentColor: '#F59E0B',
    agentCount: 4,
    taskCount: 4,
    tags: ['Marketing', 'Campaigns', 'Copywriting'],
    build: buildMarketingCampaign,
  },
  {
    id: 'software',
    name: 'Software Dev Team',
    description: 'A full development lifecycle: requirements and architecture, implementation with tests, code review, and QA validation with bug reports.',
    icon: '💻',
    accentColor: '#06B6D4',
    agentCount: 4,
    taskCount: 4,
    tags: ['Development', 'Code', 'Testing'],
    build: buildSoftwareDevTeam,
  },
];
