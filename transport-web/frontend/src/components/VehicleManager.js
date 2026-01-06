import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Plus, Search, Trash2, Edit, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { transportService } from '../lib/transport-service';

const VehicleContainer = styled.div`
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

const VehicleGrid = styled(motion.div)`
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
  background: ${props => {
        if (props.variant === 'search') return 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
        if (props.variant === 'danger') return 'linear-gradient(135deg, #ef4444, #dc2626)';
        return 'linear-gradient(135deg, #4ade80, #22c55e)';
    }};
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

const VehicleList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const VehicleCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => getVehicleColor(props.type)};
  }
`;

const VehicleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const VehicleInfo = styled.div`
  flex: 1;
`;

const VehicleId = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #4ade80;
`;

const VehicleType = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 0.25rem;
  text-transform: capitalize;
`;

const VehicleActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const VehicleStats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: #4ade80;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: 0.25rem;
`;

const SearchBar = styled.div`
  position: relative;
  margin-bottom: 2rem;
`;

const SearchInput = styled(Input)`
  padding-left: 3rem;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.6;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  opacity: 0.6;
  grid-column: 1 / -1;
`;

const getVehicleColor = (type) => {
    const colors = {
        bus: '#f59e0b',
        metro: '#4ade80',
        tram: '#8b5cf6',
        taxi: '#ef4444',
        train: '#06b6d4'
    };
    return colors[type] || '#6b7280';
};

const getVehicleIcon = (type) => {
    const icons = {
        bus: '🚌',
        metro: '🚇',
        tram: '🚊',
        taxi: '🚕',
        train: '🚆'
    };
    return icons[type] || '🚗';
};

function VehicleManager() {
    const [vehicleForm, setVehicleForm] = useState({ id: '', type: 'bus' });
    const [searchTerm, setSearchTerm] = useState('');
    const [vehicles, setVehicles] = useState([
        { id: 101, type: 'bus', status: 'active', route: 'Route A', passengers: 24 },
        { id: 102, type: 'metro', status: 'maintenance', route: 'Line 1', passengers: 0 },
        { id: 103, type: 'tram', status: 'active', route: 'Route C', passengers: 18 },
        { id: 104, type: 'taxi', status: 'active', route: 'City Center', passengers: 2 },
    ]);

    const handleAddVehicle = async () => {
        if (!vehicleForm.id || !vehicleForm.type) {
            toast.error('Please fill all fields');
            return;
        }

        // Check for duplicate ID
        if (vehicles.some(v => v.id === parseInt(vehicleForm.id))) {
            toast.error('Vehicle ID already exists');
            return;
        }

        try {
            // Replaced fetch with transportService
            const response = await transportService.addVehicle(
                parseInt(vehicleForm.id),
                vehicleForm.type
            );

            if (response.success) {
                const newVehicle = {
                    id: parseInt(vehicleForm.id),
                    type: vehicleForm.type,
                    status: 'active',
                    route: 'Unassigned',
                    passengers: 0
                };

                setVehicles(prev => [...prev, newVehicle]);
                setVehicleForm({ id: '', type: 'bus' });
                toast.success(`Vehicle ${vehicleForm.id} added successfully`);
            } else {
                toast.error('Failed to add vehicle');
            }
        } catch (error) {
            toast.error('Connection error');
        }
    };

    const handleRemoveVehicle = async (vehicleId) => {
        try {
            // Replaced fetch with transportService
            const response = await transportService.removeVehicle(vehicleId);

            if (response.success) {
                setVehicles(prev => prev.filter(v => v.id !== vehicleId));
                toast.success(`Vehicle ${vehicleId} removed successfully`);
            } else {
                toast.error('Failed to remove vehicle');
            }
        } catch (error) {
            toast.error('Connection error');
        }
    };

    const handleSearchVehicle = async () => {
        if (!searchTerm) {
            toast.error('Please enter a vehicle ID to search');
            return;
        }

        // Client-side search simulation since we have the full list
        const vehicleExists = vehicles.some(v => v.id.toString() === searchTerm || v.type.includes(searchTerm));

        if (vehicleExists) {
            toast.success('Vehicle found!');
            // Highlight the vehicle in the list
            const element = document.getElementById(`vehicle-${searchTerm}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            toast.error('Vehicle not found');
        }
    };

    const filteredVehicles = vehicles.filter(vehicle =>
        vehicle.id.toString().includes(searchTerm) ||
        vehicle.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.route.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const generateRandomId = () => {
        const id = Math.floor(Math.random() * 900) + 100;
        setVehicleForm(prev => ({ ...prev, id: id.toString() }));
    };

    return (
        <VehicleContainer>
            <ControlPanel
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <SectionTitle>
                    <Plus size={24} />
                    Add Vehicle
                </SectionTitle>

                <FormGroup>
                    <Label>Vehicle ID</Label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Input
                            type="number"
                            placeholder="Enter ID"
                            value={vehicleForm.id}
                            onChange={(e) => setVehicleForm(prev => ({ ...prev, id: e.target.value }))}
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
                    <Label>Vehicle Type</Label>
                    <Select
                        value={vehicleForm.type}
                        onChange={(e) => setVehicleForm(prev => ({ ...prev, type: e.target.value }))}
                    >
                        <option value="bus">Bus</option>
                        <option value="metro">Metro</option>
                        <option value="tram">Tram</option>
                        <option value="taxi">Taxi</option>
                        <option value="train">Train</option>
                    </Select>
                </FormGroup>

                <ActionButton
                    onClick={handleAddVehicle}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Plus size={16} />
                    Add Vehicle
                </ActionButton>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                    <SectionTitle style={{ marginBottom: '1rem' }}>
                        <Search size={24} />
                        Search Vehicle
                    </SectionTitle>

                    <FormGroup>
                        <Input
                            type="text"
                            placeholder="Enter vehicle ID, type, or route"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </FormGroup>

                    <ActionButton
                        variant="search"
                        onClick={handleSearchVehicle}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Search size={16} />
                        Search Vehicle
                    </ActionButton>
                </div>
            </ControlPanel>

            <VehicleGrid
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <SectionTitle>
                    <Car size={24} />
                    Vehicle Fleet ({vehicles.length})
                </SectionTitle>

                <SearchBar>
                    <SearchIcon>
                        <Search size={16} />
                    </SearchIcon>
                    <SearchInput
                        type="text"
                        placeholder="Filter vehicles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </SearchBar>

                <VehicleList>
                    <AnimatePresence>
                        {filteredVehicles.length === 0 ? (
                            <EmptyState>
                                <Car size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                <p>No vehicles found</p>
                                <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                                    {vehicles.length === 0 ? 'Add vehicles using the form on the left' : 'Try adjusting your search terms'}
                                </p>
                            </EmptyState>
                        ) : (
                            filteredVehicles.map((vehicle) => (
                                <VehicleCard
                                    key={vehicle.id}
                                    id={`vehicle-${vehicle.id}`}
                                    type={vehicle.type}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    layout
                                >
                                    <VehicleHeader>
                                        <VehicleInfo>
                                            <VehicleId>
                                                {getVehicleIcon(vehicle.type)} #{vehicle.id}
                                            </VehicleId>
                                            <VehicleType>{vehicle.type}</VehicleType>
                                        </VehicleInfo>

                                        <VehicleActions>
                                            <IconButton
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Edit size={14} />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleRemoveVehicle(vehicle.id)}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                style={{ color: '#ef4444' }}
                                            >
                                                <Trash2 size={14} />
                                            </IconButton>
                                        </VehicleActions>
                                    </VehicleHeader>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginBottom: '1rem'
                                    }}>
                                        <MapPin size={14} style={{ opacity: 0.7 }} />
                                        <span style={{ fontSize: '0.9rem' }}>{vehicle.route}</span>
                                    </div>

                                    <div style={{
                                        display: 'inline-block',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '12px',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        background: vehicle.status === 'active' ?
                                            'rgba(74, 222, 128, 0.2)' :
                                            'rgba(239, 68, 68, 0.2)',
                                        color: vehicle.status === 'active' ? '#4ade80' : '#ef4444',
                                        marginBottom: '1rem'
                                    }}>
                                        {vehicle.status.toUpperCase()}
                                    </div>

                                    <VehicleStats>
                                        <StatItem>
                                            <StatValue>{vehicle.passengers}</StatValue>
                                            <StatLabel>Passengers</StatLabel>
                                        </StatItem>
                                        <StatItem>
                                            <StatValue>{Math.floor(Math.random() * 100)}%</StatValue>
                                            <StatLabel>Capacity</StatLabel>
                                        </StatItem>
                                    </VehicleStats>
                                </VehicleCard>
                            ))
                        )}
                    </AnimatePresence>
                </VehicleList>
            </VehicleGrid>
        </VehicleContainer>
    );
}

export default VehicleManager;