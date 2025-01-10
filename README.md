# CrewAI Visual Editor

A visual node-based editor for creating and managing CrewAI crews. This tool allows you to visually design your agent crews, define tasks, and execute them directly from the interface.

## Features

- Drag-and-drop interface for creating crews
- Visual task and agent node creation
- Real-time crew visualization
- Direct execution of created crews
- YAML export/import functionality

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Python 3.8+ (for CrewAI execution)

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd crew-editor
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Drag agent and task nodes from the sidebar onto the canvas
2. Connect nodes by dragging from one node's handle to another
3. Configure each node's properties in the node's card
4. Click the "Run Crew" button to execute your crew

## Development

This project is built with:
- React + TypeScript
- Vite
- React Flow
- Material-UI
- CrewAI

## License

MIT
