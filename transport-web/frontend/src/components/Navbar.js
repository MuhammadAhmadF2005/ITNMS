import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Home,
  Network,
  Users,
  Car,
  BarChart3,
  Map,
  Wifi,
  WifiOff
} from 'lucide-react';

const NavContainer = styled.nav`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 2rem;
`;

const NavContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
  
  ${props => props.active && `
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  `}
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 0.9rem;
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.connected ? '#4ade80' : '#ef4444'};
  animation: ${props => props.connected ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/network', label: 'Network', icon: Network },
  { path: '/pathfinder', label: 'Path Finder', icon: Map },
  { path: '/passengers', label: 'Passengers', icon: Users },
  { path: '/vehicles', label: 'Vehicles', icon: Car },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
];

function Navbar({ systemStatus }) {
  const location = useLocation();

  return (
    <NavContainer>
      <NavContent>
        <Logo
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          🚇 Transport Network
        </Logo>

        <NavLinks>
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <NavLink to={item.path} active={isActive}>
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              </motion.div>
            );
          })}
        </NavLinks>

        <StatusIndicator>
          {systemStatus.connected ? <Wifi size={16} /> : <WifiOff size={16} />}
          <StatusDot connected={systemStatus.connected} />
          {systemStatus.connected ? 'Connected' : 'Disconnected'}
        </StatusIndicator>
      </NavContent>
    </NavContainer>
  );
}

export default Navbar;