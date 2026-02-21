import { Node, Edge } from 'reactflow';
import { AgentData, TaskData, CrewSettings } from '../types';

export function generateAgentsYaml(nodes: Node[], _edges: Edge[]): string {
  const agents = nodes.filter(n => n.type === 'agent');
  if (agents.length === 0) return '# No agents defined';

  return agents.map(agent => {
    const d = agent.data as AgentData;
    const safeName = d.name?.replace(/\s+/g, '_') || 'unnamed_agent';
    const lines: string[] = [`${safeName}:`];
    if (d.role) lines.push(`  role: >\n    ${d.role}`);
    if (d.goal) lines.push(`  goal: >\n    ${d.goal}`);
    if (d.backstory) lines.push(`  backstory: >\n    ${d.backstory}`);
    if (d.llm) lines.push(`  llm: ${d.llm}`);
    if (d.tools?.length > 0) {
      lines.push(`  tools:`);
      d.tools.forEach(t => lines.push(`    - ${t}`));
    }
    if (d.allowDelegation) lines.push(`  allow_delegation: true`);
    if (!d.verbose) lines.push(`  verbose: false`);
    if (d.memory === false) lines.push(`  memory: false`);
    if (d.maxIter !== 25) lines.push(`  max_iter: ${d.maxIter}`);
    if (d.maxRpm > 0) lines.push(`  max_rpm: ${d.maxRpm}`);
    if (d.allowCodeExecution) lines.push(`  allow_code_execution: true`);
    if (d.maxRetryLimit !== 2) lines.push(`  max_retry_limit: ${d.maxRetryLimit}`);
    if (!d.cacheEnabled) lines.push(`  cache: false`);
    return lines.join('\n');
  }).join('\n\n');
}

export function generateTasksYaml(nodes: Node[], edges: Edge[]): string {
  const tasks = nodes.filter(n => n.type === 'task');
  if (tasks.length === 0) return '# No tasks defined';

  return tasks.map(task => {
    const d = task.data as TaskData;
    const safeName = d.name?.replace(/\s+/g, '_') || 'unnamed_task';
    const agentEdge = edges.find(e =>
      e.target === task.id && nodes.find(n => n.id === e.source)?.type === 'agent'
    );
    const agentName = agentEdge
      ? (nodes.find(n => n.id === agentEdge.source)?.data as AgentData)?.name?.replace(/\s+/g, '_')
      : null;

    const contextEdges = edges.filter(e =>
      e.target === task.id &&
      e.targetHandle === 'exec-in' &&
      nodes.find(n => n.id === e.source)?.type === 'task'
    );
    const contextNames = contextEdges
      .map(e => (nodes.find(n => n.id === e.source)?.data as TaskData)?.name?.replace(/\s+/g, '_'))
      .filter(Boolean);

    const lines: string[] = [`${safeName}:`];
    if (d.description) lines.push(`  description: >\n    ${d.description}`);
    if (d.expected_output) lines.push(`  expected_output: >\n    ${d.expected_output}`);
    if (agentName) lines.push(`  agent: ${agentName}`);
    if (contextNames.length > 0) {
      lines.push(`  context:`);
      contextNames.forEach(c => lines.push(`    - ${c}`));
    }
    if (d.output_file) lines.push(`  output_file: ${d.output_file}`);
    if (d.async_execution) lines.push(`  async_execution: true`);
    if (d.human_input) lines.push(`  human_input: true`);
    return lines.join('\n');
  }).join('\n\n');
}

export function generatePythonCode(nodes: Node[], edges: Edge[], crewSettings: CrewSettings): string {
  const agents = nodes.filter(n => n.type === 'agent');

  const allTools = new Set<string>();
  agents.forEach(a => {
    const d = a.data as AgentData;
    d.tools?.forEach(t => allTools.add(t));
  });

  const toolImports = allTools.size > 0
    ? `from crewai_tools import ${[...allTools].join(', ')}\n`
    : '';

  const agentsCode = agents.map(agent => {
    const d = agent.data as AgentData;
    const safeName = d.name?.replace(/\s+/g, '_') || 'unnamed_agent';
    const toolsList = d.tools?.map(t => `${t}()`).join(', ') || '';
    return `    @agent\n    def ${safeName}(self) -> Agent:\n        return Agent(\n            config=self.agents_config['${safeName}'],\n            verbose=${d.verbose ? 'True' : 'False'},\n            tools=[${toolsList}]\n        )`;
  }).join('\n\n');

  const taskOrder = getTaskOrder(nodes, edges);

  const tasksCode = taskOrder.map(safeName => {
    const taskNode = nodes.find(n =>
      n.type === 'task' && (n.data as TaskData).name?.replace(/\s+/g, '_') === safeName
    );
    if (!taskNode) return '';
    const d = taskNode.data as TaskData;

    const contextTasks = edges
      .filter(e =>
        e.target === taskNode.id &&
        e.targetHandle === 'exec-in' &&
        nodes.find(n => n.id === e.source)?.type === 'task'
      )
      .map(e => (nodes.find(n => n.id === e.source)?.data as TaskData)?.name?.replace(/\s+/g, '_'))
      .filter(Boolean);

    const contextCode = contextTasks.length > 0
      ? `,\n            context=[${contextTasks.map(ct => `self.${ct}()`).join(', ')}]`
      : '';
    const outputCode = d.output_file
      ? `,\n            output_file='${d.output_file}'`
      : '';

    return `    @task\n    def ${safeName}(self) -> Task:\n        return Task(\n            config=self.tasks_config['${safeName}']${outputCode}${contextCode}\n        )`;
  }).join('\n\n');

  const processType = crewSettings.process === 'hierarchical' ? 'Process.hierarchical' : 'Process.sequential';
  const managerLlm = crewSettings.process === 'hierarchical' && crewSettings.managerLlm
    ? `,\n            manager_llm='${crewSettings.managerLlm}'`
    : '';
  const planningCode = crewSettings.planning
    ? `,\n            planning=True${crewSettings.plannerLlm ? `,\n            planning_llm='${crewSettings.plannerLlm}'` : ''}`
    : '';

  const className = crewSettings.name?.replace(/\s+/g, '') || 'GeneratedCrew';
  const inputs = crewSettings.inputs?.filter(i => i.name) || [];
  const hasInputs = inputs.length > 0;

  const kickoffExample = hasInputs
    ? `


# ─── Usage ────────────────────────────────────────────────────────────────────
# ${className}().crew().kickoff(inputs={
${inputs.map(i => `#     '${i.name}': '${i.defaultValue || `<${i.description || i.name}>`}'`).join(',\n')}
# })`
    : '';

  return `"""${crewSettings.name || 'Generated Crew'} - Built with CrewAI Visual Editor"""

from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
${toolImports}

@CrewBase
class ${className}():
    """${crewSettings.name || 'Generated Crew'}"""

    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'

${agentsCode}

${tasksCode}

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=${processType},
            verbose=${crewSettings.verbose ? 'True' : 'False'},
            memory=${crewSettings.memory ? 'True' : 'False'},
            cache=${crewSettings.cache ? 'True' : 'False'}${managerLlm}${planningCode}
        )${kickoffExample}`;
}

function getTaskOrder(nodes: Node[], edges: Edge[]): string[] {
  const beginNode = nodes.find(n => n.type === 'begin');
  if (!beginNode) {
    return nodes
      .filter(n => n.type === 'task')
      .map(n => (n.data as TaskData).name?.replace(/\s+/g, '_') || '');
  }

  const orderedTasks: string[] = [];
  const visited = new Set<string>();

  const dfs = (nodeId: string) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const outgoing = edges.filter(e => {
      if (e.source !== nodeId) return false;
      const target = nodes.find(n => n.id === e.target);
      return target?.type === 'task' || target?.type === 'reroute';
    });

    outgoing.forEach(edge => {
      const target = nodes.find(n => n.id === edge.target);
      if (target?.type === 'task') {
        const name = (target.data as TaskData).name?.replace(/\s+/g, '_') || '';
        if (name && !orderedTasks.includes(name)) orderedTasks.push(name);
      }
      dfs(edge.target);
    });
  };

  dfs(beginNode.id);

  nodes
    .filter(n => n.type === 'task' && !visited.has(n.id))
    .forEach(n => {
      const name = (n.data as TaskData).name?.replace(/\s+/g, '_') || '';
      if (name && !orderedTasks.includes(name)) orderedTasks.push(name);
    });

  return orderedTasks;
}
