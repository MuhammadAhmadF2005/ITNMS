import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
    MapPin,
    Users,
    Car,
    Activity,
    Plus,
    Trash2,
    Play
} from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
  font-size: 2rem;
  font-weight: bold;
  color: #4ade80;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 0.5rem;
`;

const QuickActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
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

const RecentActivity = styled.div`
  max-height: 200px;
  overflow-y: auto;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 0.5rem;
`;

const ActivityTime = styled.span`
  font-size: 0.8rem;
  opacity: 0.6;
`;

function Dashboard({ systemStatus }) {
    const [stationForm, setStationForm] = useState({ id: '', name: '' });
    const [routeForm, setRouteForm] = useState({ source: '', destination: '', weight: '' });
    const [recentActivities, setRecentActivities] = useState([
        { id: 1, action: 'Station added', details: 'Central Station', time: '2 min ago' },
        { id: 2, action: 'Route created', details: 'A → B (5km)', time: '5 min ago' },
        { id: 3, action: 'Passenger processed', details: 'Queue #1', time: '8 min ago' },
    ]);

    const handleAddStation = async () => {
        if (!stationForm.id || !stationForm.name) {
            toast.error('Please fill all fields');
            return;
        }

        try {
            const response = await fetch('/api/stations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: parseInt(stationForm.id),
                    name: stationForm.name
                })
            });

            if (response.ok) {
                toast.success('Station added successfully!');
                setStationForm({ id: '', name: '' });
                addActivity('Station added', stationForm.name);
            } else {
                toast.error('Failed to add station');
            }
        } catch (error) {
            toast.error('Connection error');
        }
    };

    const handleAddRoute = async () => {
        if (!routeForm.source || !routeForm.destination || !routeForm.weight) {
            toast.error('Please fill all fields');
            return;
        }

        try {
            const response = await fetch('/api/routes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    source: parseInt(routeForm.source),
                    destination: parseInt(routeForm.destination),
                    weight: parseInt(routeForm.weight)
                })
            });

            if (response.ok) {
                toast.success('Route added successfully!');
                setRouteForm({ source: '', destination: '', weight: '' });
                addActivity('Route created', `${routeForm.source} → ${routeForm.destination}`);
            } else {
                toast.error('Failed to add route');
            }
        } catch (error) {
            toast.error('Connection error');
        }
    };

    const addActivity = (action, details) => {
        const newActivity = {
            id: Date.now(),
            action,
            details,
            time: 'Just now'
        };
        setRecentActivities(prev => [newActivity, ...prev.slice(0, 4)]);
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <DashboardContainer>
            {/* System Overview */}
            <Card
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5 }}
            >
                <CardHeader>
                    <Activity size={24} />
                    <CardTitle>System Overview</CardTitle>
                </CardHeader>

                <StatGrid>
                    <StatCard>
                        <StatValue>{systemStatus.stationCount}</StatValue>
                        <StatLabel>Stations</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatValue>{systemStatus.queueLength}</StatValue>
                        <StatLabel>Queue Length</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatValue>{systemStatus.vehicleCount}</StatValue>
                        <StatLabel>Vehicles</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatValue>{systemStatus.connected ? 'Online' : 'Offline'}</StatValue>
                        <StatLabel>Status</StatLabel>
                    </StatCard>
                </StatGrid>
            </Card>

            {/* Quick Station Management */}
            <Card
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <CardHeader>
                    <MapPin size={24} />
                    <CardTitle>Station Management</CardTitle>
                </CardHeader>

                <FormContainer>
                    <Input
                        type="number"
                        placeholder="Station ID"
                        value={stationForm.id}
                        onChange={(e) => setStationForm(prev => ({ ...prev, id: e.target.value }))}
                    />
                    <Input
                        type="text"
                        placeholder="Station Name"
                        value={stationForm.name}
                        onChange={(e) => setStationForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <ActionButton
                        onClick={handleAddStation}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Plus size={16} />
                        Add Station
                    </ActionButton>
                </FormContainer>
            </Card>

            {/* Quick Route Management */}
            <Card
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <CardHeader>
                    <MapPin size={24} />
                    <CardTitle>Route Management</CardTitle>
                </CardHeader>

                <FormContainer>
                    <Input
                        type="number"
                        placeholder="Source Station ID"
                        value={routeForm.source}
                        onChange={(e) => setRouteForm(prev => ({ ...prev, source: e.target.value }))}
                    />
                    <Input
                        type="number"
                        placeholder="Destination Station ID"
                        value={routeForm.destination}
                        onChange={(e) => setRouteForm(prev => ({ ...prev, destination: e.target.value }))}
                    />
                    <Input
                        type="number"
                        placeholder="Weight (distance/time)"
                        value={routeForm.weight}
                        onChange={(e) => setRouteForm(prev => ({ ...prev, weight: e.target.value }))}
                    />
                    <ActionButton
                        onClick={handleAddRoute}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Plus size={16} />
                        Add Route
                    </ActionButton>
                </FormContainer>
            </Card>

            {/* Recent Activity */}
            <Card
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <CardHeader>
                    <Activity size={24} />
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>

                <RecentActivity>
                    {recentActivities.map((activity) => (
                        <ActivityItem key={activity.id}>
                            <div style={{ flex: 1 }}>
                                <div>{activity.action}</div>
                                <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>{activity.details}</div>
                            </div>
                            <ActivityTime>{activity.time}</ActivityTime>
                        </ActivityItem>
                    ))}
                </RecentActivity>
            </Card>
        </DashboardContainer>
    );
}

export default Dashboard;