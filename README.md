# CrewAI Visual Editor

A visual node-based editor for creating and managing CrewAI crews. This tool allows you to visually design your agent crews, define tasks, and export them directly from the interface.

## Features

- Drag-and-drop interface for creating crews
- Visual task and agent node creation
- Real-time crew visualization
- YAML export functionality
- Python crew.py export functionality

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Python 3.10+ (for future extensions)

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

## Development

This project is built with:
- React + TypeScript
- Vite
- React Flow
- Material-UI

## License

MIT