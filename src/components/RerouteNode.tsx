import { Component } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface RerouteNodeData {
  claimedType?: 'execution' | 'agent';
  style?: React.CSSProperties;
}

interface RerouteNodeState {
  isSelected: boolean;
}

class RerouteNode extends Component<NodeProps<RerouteNodeData>, RerouteNodeState> {
  constructor(props: NodeProps<RerouteNodeData>) {
    super(props);
    this.state = {
      isSelected: false
    };
  }

  handleSelect = () => {
    this.setState(prevState => ({
      isSelected: !prevState.isSelected
    }));
  };

  getNodeStyle = () => {
    const { data } = this.props;
    const { isSelected } = this.state;

    let backgroundColor = 'gray';
    if (data.claimedType === 'execution') {
      backgroundColor = 'white';
    } else if (data.claimedType === 'agent') {
      backgroundColor = 'yellow';
    }

    return {
      width: 10,
      height: 10,
      backgroundColor,
      borderRadius: '50%',
      border: isSelected ? '2px solid white' : 'none',
      position: 'relative' as const,
      cursor: 'pointer',
      ...data.style
    };
  };

  getHandleStyle = () => {
    const { data } = this.props;
    const baseStyle = {
      background: data.claimedType === 'execution' ? 'white' : 
                  data.claimedType === 'agent' ? 'yellow' : 'gray',
      borderRadius: '50%',
      width: 6,
      height: 6,
      border: '1px solid #555',
    };

    return baseStyle;
  };

  render() {
    return (
      <div style={this.getNodeStyle()} onClick={this.handleSelect}>
        <Handle
          type="target"
          position={Position.Left}
          style={{
            ...this.getHandleStyle(),
            left: -3,
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        />
        <Handle
          type="source"
          position={Position.Right}
          style={{
            ...this.getHandleStyle(),
            right: -3,
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        />
      </div>
    );
  }
}

export default RerouteNode; 