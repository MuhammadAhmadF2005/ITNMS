import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const GraphContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  height: 80vh;
  position: relative;
`;

const GraphHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const GraphTitle = styled.h2`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const ControlButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const GraphSvg = styled.svg`
  width: 100%;
  height: calc(100% - 80px);
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.1);
`;

const InfoPanel = styled.div`
  position: absolute;
  top: 80px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  border-radius: 8px;
  min-width: 200px;
  display: ${props => props.show ? 'block' : 'none'};
`;

function NetworkGraph() {
    const svgRef = useRef();
    const [simulation, setSimulation] = useState(null);
    const [isRunning, setIsRunning] = useState(true);
    const [selectedNode, setSelectedNode] = useState(null);
    const [graphData, setGraphData] = useState({
        nodes: [
            { id: 1, name: 'Central Station', x: 400, y: 300, type: 'major' },
            { id: 2, name: 'North Terminal', x: 400, y: 150, type: 'terminal' },
            { id: 3, name: 'South Hub', x: 400, y: 450, type: 'hub' },
            { id: 4, name: 'East Junction', x: 600, y: 300, type: 'junction' },
            { id: 5, name: 'West Plaza', x: 200, y: 300, type: 'plaza' },
        ],
        links: [
            { source: 1, target: 2, weight: 5, type: 'metro' },
            { source: 1, target: 3, weight: 7, type: 'bus' },
            { source: 1, target: 4, weight: 3, type: 'metro' },
            { source: 1, target: 5, weight: 4, type: 'tram' },
            { source: 2, target: 4, weight: 8, type: 'bus' },
            { source: 3, target: 4, weight: 6, type: 'metro' },
        ]
    });

    useEffect(() => {
        initializeGraph();
        return () => {
            if (simulation) {
                simulation.stop();
            }
        };
    }, []);

    const initializeGraph = () => {
        const svg = d3.select(svgRef.current);
        const width = svg.node().clientWidth;
        const height = svg.node().clientHeight;

        // Clear previous content
        svg.selectAll('*').remove();

        // Create groups for different elements
        const linkGroup = svg.append('g').attr('class', 'links');
        const nodeGroup = svg.append('g').attr('class', 'nodes');
        const labelGroup = svg.append('g').attr('class', 'labels');

        // Create force simulation
        const sim = d3.forceSimulation(graphData.nodes)
            .force('link', d3.forceLink(graphData.links).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(30));

        // Create links
        const links = linkGroup
            .selectAll('line')
            .data(graphData.links)
            .enter()
            .append('line')
            .attr('stroke', d => getRouteColor(d.type))
            .attr('stroke-width', d => Math.sqrt(d.weight) * 2)
            .attr('stroke-opacity', 0.8)
            .style('cursor', 'pointer');

        // Create link labels
        const linkLabels = labelGroup
            .selectAll('.link-label')
            .data(graphData.links)
            .enter()
            .append('text')
            .attr('class', 'link-label')
            .attr('text-anchor', 'middle')
            .attr('font-size', '10px')
            .attr('fill', 'white')
            .attr('opacity', 0.7)
            .text(d => d.weight);

        // Create nodes
        const nodes = nodeGroup
            .selectAll('circle')
            .data(graphData.nodes)
            .enter()
            .append('circle')
            .attr('r', d => getNodeSize(d.type))
            .attr('fill', d => getNodeColor(d.type))
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .call(d3.drag()
                .on('start', dragStarted)
                .on('drag', dragged)
                .on('end', dragEnded))
            .on('click', (event, d) => {
                setSelectedNode(d);
                highlightNode(d);
            })
            .on('mouseover', (event, d) => {
                d3.select(event.target)
                    .transition()
                    .duration(200)
                    .attr('r', getNodeSize(d.type) * 1.2);
            })
            .on('mouseout', (event, d) => {
                d3.select(event.target)
                    .transition()
                    .duration(200)
                    .attr('r', getNodeSize(d.type));
            });

        // Create node labels
        const nodeLabels = labelGroup
            .selectAll('.node-label')
            .data(graphData.nodes)
            .enter()
            .append('text')
            .attr('class', 'node-label')
            .attr('text-anchor', 'middle')
            .attr('dy', -25)
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .attr('fill', 'white')
            .text(d => d.name);

        // Update positions on simulation tick
        sim.on('tick', () => {
            links
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            linkLabels
                .attr('x', d => (d.source.x + d.target.x) / 2)
                .attr('y', d => (d.source.y + d.target.y) / 2);

            nodes
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);

            nodeLabels
                .attr('x', d => d.x)
                .attr('y', d => d.y);
        });

        setSimulation(sim);

        // Drag functions
        function dragStarted(event, d) {
            if (!event.active) sim.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragEnded(event, d) {
            if (!event.active) sim.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    };

    const getNodeColor = (type) => {
        const colors = {
            major: '#4ade80',
            terminal: '#f59e0b',
            hub: '#ef4444',
            junction: '#8b5cf6',
            plaza: '#06b6d4'
        };
        return colors[type] || '#6b7280';
    };

    const getNodeSize = (type) => {
        const sizes = {
            major: 20,
            terminal: 15,
            hub: 18,
            junction: 12,
            plaza: 14
        };
        return sizes[type] || 10;
    };

    const getRouteColor = (type) => {
        const colors = {
            metro: '#4ade80',
            bus: '#f59e0b',
            tram: '#8b5cf6'
        };
        return colors[type] || '#6b7280';
    };

    const highlightNode = (node) => {
        const svg = d3.select(svgRef.current);

        // Reset all nodes
        svg.selectAll('circle')
            .attr('stroke-width', 2)
            .attr('opacity', 0.3);

        svg.selectAll('line')
            .attr('opacity', 0.1);

        // Highlight selected node and connected elements
        svg.selectAll('circle')
            .filter(d => d.id === node.id)
            .attr('stroke-width', 4)
            .attr('opacity', 1);

        // Highlight connected links
        svg.selectAll('line')
            .filter(d => d.source.id === node.id || d.target.id === node.id)
            .attr('opacity', 0.8);

        // Highlight connected nodes
        const connectedNodeIds = graphData.links
            .filter(link => link.source.id === node.id || link.target.id === node.id)
            .map(link => link.source.id === node.id ? link.target.id : link.source.id);

        svg.selectAll('circle')
            .filter(d => connectedNodeIds.includes(d.id))
            .attr('opacity', 0.7);
    };

    const resetHighlight = () => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('circle')
            .attr('stroke-width', 2)
            .attr('opacity', 1);
        svg.selectAll('line')
            .attr('opacity', 0.8);
        setSelectedNode(null);
    };

    const toggleSimulation = () => {
        if (simulation) {
            if (isRunning) {
                simulation.stop();
            } else {
                simulation.restart();
            }
            setIsRunning(!isRunning);
        }
    };

    const restartSimulation = () => {
        if (simulation) {
            simulation.alpha(1).restart();
            setIsRunning(true);
        }
    };

    const runBFS = async () => {
        if (!selectedNode) {
            toast.error('Please select a starting node first');
            return;
        }

        try {
            const response = await fetch(`/api/bfs/${selectedNode.id}`);
            if (response.ok) {
                const data = await response.json();
                toast.success('BFS traversal completed');
                // Animate the traversal
                animateTraversal(data.traversal);
            }
        } catch (error) {
            toast.error('Failed to perform BFS');
        }
    };

    const animateTraversal = (traversal) => {
        const svg = d3.select(svgRef.current);

        traversal.forEach((nodeId, index) => {
            setTimeout(() => {
                svg.selectAll('circle')
                    .filter(d => d.id === nodeId)
                    .transition()
                    .duration(300)
                    .attr('fill', '#ff6b6b')
                    .transition()
                    .delay(500)
                    .duration(300)
                    .attr('fill', d => getNodeColor(d.type));
            }, index * 800);
        });
    };

    return (
        <GraphContainer
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <GraphHeader>
                <GraphTitle>
                    🌐 Network Visualization
                </GraphTitle>
                <Controls>
                    <ControlButton
                        onClick={toggleSimulation}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isRunning ? <Pause size={16} /> : <Play size={16} />}
                        {isRunning ? 'Pause' : 'Resume'}
                    </ControlButton>
                    <ControlButton
                        onClick={restartSimulation}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <RotateCcw size={16} />
                        Restart
                    </ControlButton>
                    <ControlButton
                        onClick={runBFS}
                        disabled={!selectedNode}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Zap size={16} />
                        Run BFS
                    </ControlButton>
                    <ControlButton
                        onClick={resetHighlight}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Reset
                    </ControlButton>
                </Controls>
            </GraphHeader>

            <GraphSvg ref={svgRef} />

            <InfoPanel show={selectedNode}>
                {selectedNode && (
                    <div>
                        <h4 style={{ margin: '0 0 1rem 0' }}>{selectedNode.name}</h4>
                        <p><strong>ID:</strong> {selectedNode.id}</p>
                        <p><strong>Type:</strong> {selectedNode.type}</p>
                        <p><strong>Connections:</strong> {
                            graphData.links.filter(link =>
                                link.source.id === selectedNode.id || link.target.id === selectedNode.id
                            ).length
                        }</p>
                    </div>
                )}
            </InfoPanel>
        </GraphContainer>
    );
}

export default NetworkGraph;