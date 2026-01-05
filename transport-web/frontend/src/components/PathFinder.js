import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Route, Play, MapPin, Clock, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const PathFinderContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  height: 80vh;
`;

const ControlPanel = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
`;

const ResultPanel = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  overflow-y: auto;
`;

const SectionTitle = styled.h3`
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Select = styled.select`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 1rem;
  
  option {
    background: #1f2937;
    color: white;
  }
  
  &:focus {
    outline: none;
    border-color: #4ade80;
    box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.2);
  }
`;

const ActionButton = styled(motion.button)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #4ade80, #22c55e);
  border: none;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AlgorithmSelector = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const AlgorithmButton = styled(motion.button)`
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: ${props => props.active ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background: rgba(74, 222, 128, 0.1);
  }
`;

const PathResult = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const PathHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1rem;
`;

const PathInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
`;

const InfoCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
`;

const InfoValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #4ade80;
`;

const InfoLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 0.25rem;
`;

const PathSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PathStep = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-left: 3px solid #4ade80;
`;

const StepNumber = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #4ade80;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.8rem;
`;

const LoadingSpinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #4ade80;
  border-radius: 50%;
  margin: 2rem auto;
`;

const stations = [
    { id: 1, name: 'Central Station' },
    { id: 2, name: 'North Terminal' },
    { id: 3, name: 'South Hub' },
    { id: 4, name: 'East Junction' },
    { id: 5, name: 'West Plaza' },
];

function PathFinder() {
    const [startStation, setStartStation] = useState('');
    const [endStation, setEndStation] = useState('');
    const [algorithm, setAlgorithm] = useState('dijkstra');
    const [isLoading, setIsLoading] = useState(false);
    const [pathResult, setPathResult] = useState(null);

    const handleFindPath = async () => {
        if (!startStation || !endStation) {
            toast.error('Please select both start and end stations');
            return;
        }

        if (startStation === endStation) {
            toast.error('Start and end stations cannot be the same');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`/api/shortest-path?start=${startStation}&end=${endStation}&algorithm=${algorithm}`);

            if (response.ok) {
                const data = await response.json();

                // Simulate path result for demo
                const mockResult = {
                    path: [
                        { id: parseInt(startStation), name: stations.find(s => s.id === parseInt(startStation))?.name },
                        { id: 1, name: 'Central Station' },
                        { id: parseInt(endStation), name: stations.find(s => s.id === parseInt(endStation))?.name }
                    ],
                    totalDistance: Math.floor(Math.random() * 20) + 5,
                    estimatedTime: Math.floor(Math.random() * 30) + 10,
                    algorithm: algorithm.toUpperCase()
                };

                setPathResult(mockResult);
                toast.success('Path found successfully!');
            } else {
                toast.error('Failed to find path');
            }
        } catch (error) {
            toast.error('Connection error');
        } finally {
            setIsLoading(false);
        }
    };

    const clearResults = () => {
        setPathResult(null);
        setStartStation('');
        setEndStation('');
    };

    return (
        <PathFinderContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <ControlPanel>
                <SectionTitle>
                    <Route size={24} />
                    Path Finder
                </SectionTitle>

                <FormGroup>
                    <Label>Start Station</Label>
                    <Select
                        value={startStation}
                        onChange={(e) => setStartStation(e.target.value)}
                    >
                        <option value="">Select start station</option>
                        {stations.map(station => (
                            <option key={station.id} value={station.id}>
                                {station.name}
                            </option>
                        ))}
                    </Select>
                </FormGroup>

                <FormGroup>
                    <Label>End Station</Label>
                    <Select
                        value={endStation}
                        onChange={(e) => setEndStation(e.target.value)}
                    >
                        <option value="">Select end station</option>
                        {stations.map(station => (
                            <option key={station.id} value={station.id}>
                                {station.name}
                            </option>
                        ))}
                    </Select>
                </FormGroup>

                <FormGroup>
                    <Label>Algorithm</Label>
                    <AlgorithmSelector>
                        <AlgorithmButton
                            active={algorithm === 'dijkstra'}
                            onClick={() => setAlgorithm('dijkstra')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Dijkstra
                        </AlgorithmButton>
                        <AlgorithmButton
                            active={algorithm === 'bfs'}
                            onClick={() => setAlgorithm('bfs')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            BFS
                        </AlgorithmButton>
                    </AlgorithmSelector>
                </FormGroup>

                <ActionButton
                    onClick={handleFindPath}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isLoading ? (
                        <>
                            <LoadingSpinner
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            Finding Path...
                        </>
                    ) : (
                        <>
                            <Zap size={16} />
                            Find Shortest Path
                        </>
                    )}
                </ActionButton>

                {pathResult && (
                    <ActionButton
                        onClick={clearResults}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ background: 'rgba(239, 68, 68, 0.8)' }}
                    >
                        Clear Results
                    </ActionButton>
                )}
            </ControlPanel>

            <ResultPanel>
                <SectionTitle>
                    <MapPin size={24} />
                    Path Results
                </SectionTitle>

                {isLoading && (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <LoadingSpinner
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <p>Calculating optimal path...</p>
                    </div>
                )}

                {pathResult && !isLoading && (
                    <PathResult>
                        <PathHeader>
                            <h4 style={{ margin: 0 }}>Optimal Path Found</h4>
                            <span style={{
                                background: 'rgba(74, 222, 128, 0.2)',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.8rem'
                            }}>
                                {pathResult.algorithm}
                            </span>
                        </PathHeader>

                        <PathInfo>
                            <InfoCard>
                                <InfoValue>{pathResult.totalDistance}</InfoValue>
                                <InfoLabel>Total Distance (km)</InfoLabel>
                            </InfoCard>
                            <InfoCard>
                                <InfoValue>{pathResult.estimatedTime}</InfoValue>
                                <InfoLabel>Est. Time (min)</InfoLabel>
                            </InfoCard>
                            <InfoCard>
                                <InfoValue>{pathResult.path.length - 1}</InfoValue>
                                <InfoLabel>Transfers</InfoLabel>
                            </InfoCard>
                        </PathInfo>

                        <PathSteps>
                            {pathResult.path.map((station, index) => (
                                <PathStep
                                    key={station.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <StepNumber>{index + 1}</StepNumber>
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{station.name}</div>
                                        {index < pathResult.path.length - 1 && (
                                            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                                → Next: {pathResult.path[index + 1].name}
                                            </div>
                                        )}
                                    </div>
                                    {index === 0 && <span style={{ marginLeft: 'auto', fontSize: '0.8rem', opacity: 0.7 }}>Start</span>}
                                    {index === pathResult.path.length - 1 && <span style={{ marginLeft: 'auto', fontSize: '0.8rem', opacity: 0.7 }}>End</span>}
                                </PathStep>
                            ))}
                        </PathSteps>
                    </PathResult>
                )}

                {!pathResult && !isLoading && (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        opacity: 0.6,
                        fontSize: '1.1rem'
                    }}>
                        <Route size={48} style={{ marginBottom: '1rem' }} />
                        <p>Select start and end stations to find the optimal path</p>
                    </div>
                )}
            </ResultPanel>
        </PathFinderContainer>
    );
}

export default PathFinder;