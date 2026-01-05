import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
// @ts-ignore
import styled from 'styled-components';
import { motion } from 'framer-motion';

// @ts-ignore
import Navbar from './components/Navbar';
// @ts-ignore
import Dashboard from './components/Dashboard';
// @ts-ignore
import NetworkGraph from './components/NetworkGraph';
// @ts-ignore
import PassengerQueue from './components/PassengerQueue';
// @ts-ignore
import VehicleManager from './components/VehicleManager';
// @ts-ignore
import Analytics from './components/Analytics';
// @ts-ignore
import PathFinder from './components/PathFinder';
import { LocationMap } from "./components/ui/expand-map";

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const MainContent = styled(motion.main)`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

interface SystemStatus {
    connected: boolean;
    stationCount: number;
    queueLength: number;
    vehicleCount: number;
}

function App() {
    const [systemStatus, setSystemStatus] = useState<SystemStatus>({
        connected: false,
        stationCount: 0,
        queueLength: 0,
        vehicleCount: 0
    });

    useEffect(() => {
        // Check API connection on startup
        checkSystemStatus();

        // Set up periodic status checks
        const interval = setInterval(checkSystemStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    const checkSystemStatus = async () => {
        try {
            const response = await fetch('/api/status');
            if (response.ok) {
                const data = await response.json();
                setSystemStatus({
                    connected: true,
                    ...data.status
                });
            }
        } catch (error) {
            setSystemStatus(prev => ({ ...prev, connected: false }));
        }
    };

    return (
        <Router>
            <AppContainer>
                <Navbar systemStatus={systemStatus} />
                <MainContent
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                     <div className="mb-8 flex justify-center">
                        <LocationMap location="San Francisco, CA" coordinates="37.7749° N, 122.4194° W" />
                    </div>
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard systemStatus={systemStatus} />} />
                        <Route path="/network" element={<NetworkGraph />} />
                        <Route path="/passengers" element={<PassengerQueue />} />
                        <Route path="/vehicles" element={<VehicleManager />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/pathfinder" element={<PathFinder />} />
                    </Routes>
                </MainContent>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                    }}
                />
            </AppContainer>
        </Router>
    );
}

export default App;
