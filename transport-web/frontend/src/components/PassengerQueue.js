import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Play, Clock, User } from 'lucide-react';
import toast from 'react-hot-toast';

const QueueContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  height: 80vh;
`;

const ControlPanel = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
`;

const QueueDisplay = styled(motion.div)`
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

const Input = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 1rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
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
  background: ${props => props.variant === 'process' ?
        'linear-gradient(135deg, #f59e0b, #d97706)' :
        'linear-gradient(135deg, #4ade80, #22c55e)'};
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

const QueueStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #4ade80;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 0.25rem;
`;

const QueueList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const QueueItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border-left: 4px solid ${props => props.isNext ? '#4ade80' : 'rgba(255, 255, 255, 0.2)'};
  position: relative;
  
  ${props => props.isNext && `
    background: rgba(74, 222, 128, 0.1);
    box-shadow: 0 4px 15px rgba(74, 222, 128, 0.2);
  `}
`;

const QueuePosition = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.isNext ? '#4ade80' : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.isNext ? 'black' : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
`;

const PassengerInfo = styled.div`
  flex: 1;
`;

const PassengerName = styled.div`
  font-weight: 600;
  font-size: 1rem;
`;

const PassengerDetails = styled.div`
  font-size: 0.9rem;
  opacity: 0.7;
  margin-top: 0.25rem;
`;

const WaitTime = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  opacity: 0.8;
`;

const NextIndicator = styled.div`
  position: absolute;
  top: -8px;
  right: 1rem;
  background: #4ade80;
  color: black;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  opacity: 0.6;
`;

function PassengerQueue() {
    const [passengerForm, setPassengerForm] = useState({ id: '', name: '' });
    const [queue, setQueue] = useState([
        { id: 1, name: 'Alice Johnson', joinTime: new Date(Date.now() - 300000) },
        { id: 2, name: 'Bob Smith', joinTime: new Date(Date.now() - 240000) },
        { id: 3, name: 'Carol Davis', joinTime: new Date(Date.now() - 180000) },
    ]);
    const [totalProcessed, setTotalProcessed] = useState(12);
    const [averageWaitTime, setAverageWaitTime] = useState(4.2);

    const handleAddPassenger = async () => {
        if (!passengerForm.id || !passengerForm.name) {
            toast.error('Please fill all fields');
            return;
        }

        // Check for duplicate ID
        if (queue.some(p => p.id === parseInt(passengerForm.id))) {
            toast.error('Passenger ID already exists');
            return;
        }

        try {
            const response = await fetch('/api/passengers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: parseInt(passengerForm.id),
                    name: passengerForm.name
                })
            });

            if (response.ok) {
                const newPassenger = {
                    id: parseInt(passengerForm.id),
                    name: passengerForm.name,
                    joinTime: new Date()
                };

                setQueue(prev => [...prev, newPassenger]);
                setPassengerForm({ id: '', name: '' });
                toast.success(`${passengerForm.name} added to queue`);
            } else {
                toast.error('Failed to add passenger');
            }
        } catch (error) {
            // Fallback for demo
            const newPassenger = {
                id: parseInt(passengerForm.id),
                name: passengerForm.name,
                joinTime: new Date()
            };

            setQueue(prev => [...prev, newPassenger]);
            setPassengerForm({ id: '', name: '' });
            toast.success(`${passengerForm.name} added to queue`);
        }
    };

    const handleProcessNext = async () => {
        if (queue.length === 0) {
            toast.error('Queue is empty');
            return;
        }

        try {
            const response = await fetch('/api/passengers', {
                method: 'DELETE'
            });

            const processedPassenger = queue[0];
            setQueue(prev => prev.slice(1));
            setTotalProcessed(prev => prev + 1);

            // Update average wait time
            const waitTime = (Date.now() - processedPassenger.joinTime.getTime()) / 60000;
            setAverageWaitTime(prev => ((prev * totalProcessed) + waitTime) / (totalProcessed + 1));

            toast.success(`${processedPassenger.name} processed successfully`);
        } catch (error) {
            // Fallback for demo
            const processedPassenger = queue[0];
            setQueue(prev => prev.slice(1));
            setTotalProcessed(prev => prev + 1);
            toast.success(`${processedPassenger.name} processed successfully`);
        }
    };

    const getWaitTime = (joinTime) => {
        const minutes = Math.floor((Date.now() - joinTime.getTime()) / 60000);
        return minutes < 1 ? 'Just joined' : `${minutes} min`;
    };

    const generateRandomId = () => {
        const id = Math.floor(Math.random() * 9000) + 1000;
        setPassengerForm(prev => ({ ...prev, id: id.toString() }));
    };

    return (
        <QueueContainer>
            <ControlPanel
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <SectionTitle>
                    <Plus size={24} />
                    Add Passenger
                </SectionTitle>

                <FormGroup>
                    <Label>Passenger ID</Label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Input
                            type="number"
                            placeholder="Enter ID"
                            value={passengerForm.id}
                            onChange={(e) => setPassengerForm(prev => ({ ...prev, id: e.target.value }))}
                        />
                        <motion.button
                            onClick={generateRandomId}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            🎲
                        </motion.button>
                    </div>
                </FormGroup>

                <FormGroup>
                    <Label>Passenger Name</Label>
                    <Input
                        type="text"
                        placeholder="Enter name"
                        value={passengerForm.name}
                        onChange={(e) => setPassengerForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                </FormGroup>

                <ActionButton
                    onClick={handleAddPassenger}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Plus size={16} />
                    Add to Queue
                </ActionButton>

                <ActionButton
                    variant="process"
                    onClick={handleProcessNext}
                    disabled={queue.length === 0}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Play size={16} />
                    Process Next ({queue.length})
                </ActionButton>
            </ControlPanel>

            <QueueDisplay
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <SectionTitle>
                    <Users size={24} />
                    Passenger Queue
                </SectionTitle>

                <QueueStats>
                    <StatCard>
                        <StatValue>{queue.length}</StatValue>
                        <StatLabel>In Queue</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatValue>{totalProcessed}</StatValue>
                        <StatLabel>Processed Today</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatValue>{averageWaitTime.toFixed(1)}</StatValue>
                        <StatLabel>Avg Wait (min)</StatLabel>
                    </StatCard>
                </QueueStats>

                <QueueList>
                    <AnimatePresence>
                        {queue.length === 0 ? (
                            <EmptyState>
                                <Users size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                <p>No passengers in queue</p>
                                <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                                    Add passengers using the form on the left
                                </p>
                            </EmptyState>
                        ) : (
                            queue.map((passenger, index) => (
                                <QueueItem
                                    key={passenger.id}
                                    isNext={index === 0}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ duration: 0.3 }}
                                    layout
                                >
                                    {index === 0 && <NextIndicator>NEXT</NextIndicator>}

                                    <QueuePosition isNext={index === 0}>
                                        {index + 1}
                                    </QueuePosition>

                                    <User size={20} style={{ opacity: 0.7 }} />

                                    <PassengerInfo>
                                        <PassengerName>{passenger.name}</PassengerName>
                                        <PassengerDetails>ID: {passenger.id}</PassengerDetails>
                                    </PassengerInfo>

                                    <WaitTime>
                                        <Clock size={14} />
                                        {getWaitTime(passenger.joinTime)}
                                    </WaitTime>
                                </QueueItem>
                            ))
                        )}
                    </AnimatePresence>
                </QueueList>
            </QueueDisplay>
        </QueueContainer>
    );
}

export default PassengerQueue;