import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useOutletContext } from 'react-router-dom';
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
import { PixelTrailDemo } from "./components/PixelTrailDemo";
import { BGPattern } from "./components/ui/bg-pattern";
import { transportService } from "./lib/transport-service";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import SignUp from './components/SignUp';

const AppContainer = styled.div`
  min-height: 100vh;
  position: relative;
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);  <-- Removing old gradient to let BGPattern show, or layering it */
  background-color: #0f172a; /* Fallback navy */
  overflow: hidden;
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

function PrivateLayout() {
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
            // Replaced fetch with client-side service for Vercel demo
            const response = await transportService.getSystemStatus();
            if (response.success) {
                setSystemStatus({
                    connected: true,
                    ...response.status
                });
            }
        } catch (error) {
            setSystemStatus(prev => ({ ...prev, connected: false }));
        }
    };

    return (
        <AppContainer>
            <BGPattern variant="grid" fill="#1e293b" size={40} className="opacity-50" />
            <Navbar systemStatus={systemStatus} />
            <MainContent
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-8 flex justify-center">
                    <LocationMap location="San Francisco, CA" coordinates="37.7749° N, 122.4194° W" />
                </div>
                <Outlet context={{ systemStatus }} />
            </MainContent>
        </AppContainer>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />

                    <Route element={<ProtectedRoute />}>
                        <Route element={<PrivateLayout />}>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            {/* Note: If dashboard needs systemStatus, we can pass it via Outlet context or just let it fetch/mock if needed, 
                                but here we already have it in PrivateLayout. 
                                Since the original code passed it as prop `systemStatus={systemStatus}`, 
                                we might need to adjust Dashboard to read from context or cloning. 
                                However, easier here is effectively handled by Outlet. 
                                But React Router Outlet Context is the way. 
                                Or simply, just render the component with props if we weren't using Outlet.
                                For now, I'll assume components manage or I pass it to Outlet context.
                            */}
                            <Route path="/dashboard" element={<DashboardConsumer />} />
                            <Route path="/network" element={<NetworkGraph />} />
                            <Route path="/passengers" element={<PassengerQueue />} />
                            <Route path="/vehicles" element={<VehicleManager />} />
                            <Route path="/analytics" element={<Analytics />} />
                            <Route path="/pathfinder" element={<PathFinder />} />
                            <Route path="/demo" element={<div className="h-[80vh] w-full border border-gray-200 rounded-lg overflow-hidden relative"><PixelTrailDemo /></div>} />
                        </Route>
                    </Route>
                </Routes>
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
            </AuthProvider>
        </Router>
    );
}


function DashboardConsumer() {
    const { systemStatus } = useOutletContext<{ systemStatus: SystemStatus }>();
    return <Dashboard systemStatus={systemStatus} />;
}

export default App;
