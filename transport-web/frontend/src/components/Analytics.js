import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, MapPin, Clock, Activity } from 'lucide-react';

const AnalyticsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
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
  margin-bottom: 2rem;
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const ChartContainer = styled.div`
  height: 300px;
  position: relative;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: end;
  justify-content: space-around;
  gap: 0.5rem;
`;

const Bar = styled(motion.div)`
  background: linear-gradient(to top, #4ade80, #22c55e);
  border-radius: 4px 4px 0 0;
  min-width: 30px;
  position: relative;
  display: flex;
  align-items: end;
  justify-content: center;
  
  &::after {
    content: '${props => props.value}';
    position: absolute;
    bottom: -25px;
    font-size: 0.8rem;
    color: white;
    opacity: 0.8;
  }
  
  &::before {
    content: '${props => props.label}';
    position: absolute;
    bottom: -45px;
    font-size: 0.7rem;
    color: white;
    opacity: 0.6;
    white-space: nowrap;
  }
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const MetricCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #4ade80;
  margin-bottom: 0.5rem;
`;

const MetricLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const MetricChange = styled.div`
  font-size: 0.8rem;
  margin-top: 0.5rem;
  color: ${props => props.positive ? '#4ade80' : '#ef4444'};
`;

const TopList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const ItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ItemRank = styled.div`
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

const ItemName = styled.div`
  font-weight: 500;
`;

const ItemValue = styled.div`
  font-weight: bold;
  color: #4ade80;
`;

const TimelineContainer = styled.div`
  height: 200px;
  position: relative;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 1rem;
  overflow: hidden;
`;

const TimelinePath = styled.svg`
  width: 100%;
  height: 100%;
`;

const HeatmapGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-top: 1rem;
`;

const HeatmapCell = styled.div`
  aspect-ratio: 1;
  border-radius: 2px;
  background: ${props => {
        const intensity = props.value / 100;
        return `rgba(74, 222, 128, ${intensity})`;
    }};
  position: relative;
  cursor: pointer;
  
  &:hover::after {
    content: '${props => props.day}: ${props => props.value}%';
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.7rem;
    white-space: nowrap;
    z-index: 10;
  }
`;

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function Analytics() {
    const [stationData, setStationData] = useState([
        { name: 'Central', visits: 1250 },
        { name: 'North', visits: 890 },
        { name: 'South', visits: 720 },
        { name: 'East', visits: 650 },
        { name: 'West', visits: 580 },
    ]);

    const [routeData, setRouteData] = useState([
        { name: 'Route A-B', usage: 85 },
        { name: 'Route B-C', usage: 72 },
        { name: 'Route C-D', usage: 68 },
        { name: 'Route A-D', usage: 55 },
        { name: 'Route B-D', usage: 42 },
    ]);

    const [weeklyData, setWeeklyData] = useState(
        days.map(day => ({
            day,
            value: Math.floor(Math.random() * 60) + 40
        }))
    );

    const [metrics, setMetrics] = useState({
        totalPassengers: 15420,
        avgWaitTime: 3.2,
        systemEfficiency: 94.5,
        activeVehicles: 28
    });

    const maxVisits = Math.max(...stationData.map(s => s.visits));
    const maxUsage = Math.max(...routeData.map(r => r.usage));

    const generatePath = () => {
        const points = [];
        for (let i = 0; i <= 20; i++) {
            const x = (i / 20) * 100;
            const y = 50 + Math.sin(i * 0.5) * 20 + Math.random() * 10;
            points.push(`${x},${y}`);
        }
        return `M ${points.join(' L ')}`;
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <AnalyticsContainer>
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

                <MetricGrid>
                    <MetricCard>
                        <MetricValue>{metrics.totalPassengers.toLocaleString()}</MetricValue>
                        <MetricLabel>Total Passengers</MetricLabel>
                        <MetricChange positive>+12.5% from yesterday</MetricChange>
                    </MetricCard>

                    <MetricCard>
                        <MetricValue>{metrics.avgWaitTime}</MetricValue>
                        <MetricLabel>Avg Wait Time (min)</MetricLabel>
                        <MetricChange positive={false}>+0.3 from yesterday</MetricChange>
                    </MetricCard>

                    <MetricCard>
                        <MetricValue>{metrics.systemEfficiency}%</MetricValue>
                        <MetricLabel>System Efficiency</MetricLabel>
                        <MetricChange positive>+2.1% from yesterday</MetricChange>
                    </MetricCard>

                    <MetricCard>
                        <MetricValue>{metrics.activeVehicles}</MetricValue>
                        <MetricLabel>Active Vehicles</MetricLabel>
                        <MetricChange positive>+3 from yesterday</MetricChange>
                    </MetricCard>
                </MetricGrid>
            </Card>

            {/* Station Traffic */}
            <Card
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <CardHeader>
                    <MapPin size={24} />
                    <CardTitle>Station Traffic</CardTitle>
                </CardHeader>

                <ChartContainer>
                    {stationData.map((station, index) => (
                        <Bar
                            key={station.name}
                            value={station.visits}
                            label={station.name}
                            initial={{ height: 0 }}
                            animate={{ height: `${(station.visits / maxVisits) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                        />
                    ))}
                </ChartContainer>
            </Card>

            {/* Route Usage */}
            <Card
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <CardHeader>
                    <TrendingUp size={24} />
                    <CardTitle>Route Usage</CardTitle>
                </CardHeader>

                <TopList>
                    {routeData.map((route, index) => (
                        <motion.div
                            key={route.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <ListItem>
                                <ItemInfo>
                                    <ItemRank>{index + 1}</ItemRank>
                                    <ItemName>{route.name}</ItemName>
                                </ItemInfo>
                                <ItemValue>{route.usage}%</ItemValue>
                            </ListItem>
                        </motion.div>
                    ))}
                </TopList>
            </Card>

            {/* Real-time Trends */}
            <Card
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <CardHeader>
                    <BarChart3 size={24} />
                    <CardTitle>Real-time Trends</CardTitle>
                </CardHeader>

                <TimelineContainer>
                    <TimelinePath>
                        <motion.path
                            d={generatePath()}
                            fill="none"
                            stroke="#4ade80"
                            strokeWidth="2"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2 }}
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#4ade80" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#22c55e" stopOpacity="0.8" />
                            </linearGradient>
                        </defs>
                    </TimelinePath>
                </TimelineContainer>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '1rem',
                    fontSize: '0.8rem',
                    opacity: 0.7
                }}>
                    <span>12:00</span>
                    <span>Current Traffic Flow</span>
                    <span>18:00</span>
                </div>
            </Card>

            {/* Weekly Heatmap */}
            <Card
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <CardHeader>
                    <Clock size={24} />
                    <CardTitle>Weekly Usage Pattern</CardTitle>
                </CardHeader>

                <HeatmapGrid>
                    {weeklyData.map((day, index) => (
                        <motion.div
                            key={day.day}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <HeatmapCell
                                value={day.value}
                                day={day.day}
                            />
                        </motion.div>
                    ))}
                </HeatmapGrid>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '1rem',
                    fontSize: '0.8rem',
                    opacity: 0.7
                }}>
                    {days.map(day => (
                        <span key={day}>{day}</span>
                    ))}
                </div>
            </Card>

            {/* Performance Metrics */}
            <Card
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <CardHeader>
                    <Users size={24} />
                    <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>

                <TopList>
                    <ListItem>
                        <ItemInfo>
                            <div style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: '#4ade80'
                            }} />
                            <ItemName>Peak Hour Efficiency</ItemName>
                        </ItemInfo>
                        <ItemValue>92.3%</ItemValue>
                    </ListItem>

                    <ListItem>
                        <ItemInfo>
                            <div style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: '#f59e0b'
                            }} />
                            <ItemName>Average Delay</ItemName>
                        </ItemInfo>
                        <ItemValue>2.1 min</ItemValue>
                    </ListItem>

                    <ListItem>
                        <ItemInfo>
                            <div style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: '#8b5cf6'
                            }} />
                            <ItemName>Customer Satisfaction</ItemName>
                        </ItemInfo>
                        <ItemValue>4.7/5</ItemValue>
                    </ListItem>

                    <ListItem>
                        <ItemInfo>
                            <div style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: '#06b6d4'
                            }} />
                            <ItemName>Energy Efficiency</ItemName>
                        </ItemInfo>
                        <ItemValue>87.5%</ItemValue>
                    </ListItem>
                </TopList>
            </Card>
        </AnalyticsContainer>
    );
}

export default Analytics;