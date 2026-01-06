
import { v4 as uuidv4 } from 'uuid';

// Types mimicking the C++ structures
export interface Station {
    id: number;
    name: string;
}

export interface Route {
    source: number;
    destination: number;
    weight: number;
}

export interface Vehicle {
    id: number;
    type: string;
}

export interface Passenger {
    id: number;
    name: string;
}

export interface SystemStatus {
    connected: boolean;
    stationCount: number;
    queueLength: number;
    vehicleCount: number;
}

class TransportService {
    private stations: Map<number, string> = new Map();
    private routes: Route[] = [];
    private vehicles: Vehicle[] = [];
    private passengerQueue: Passenger[] = [];

    // Analytics logic
    private stationVisits: Map<number, number> = new Map();

    constructor() {
        this.initializeDemoData();
    }

    private initializeDemoData() {
        // Initialize with same demo data as C++ backend
        this.stations.set(1, "Central Station");
        this.stations.set(2, "North Terminal");
        this.stations.set(3, "South Hub");
        this.stations.set(4, "East Junction");
        this.stations.set(5, "West Plaza");

        this.routes.push({ source: 1, destination: 2, weight: 5 });
        this.routes.push({ source: 1, destination: 3, weight: 7 });
        this.routes.push({ source: 1, destination: 4, weight: 3 });
        this.routes.push({ source: 1, destination: 5, weight: 4 });

        this.vehicles.push({ id: 101, type: "bus" });
        this.vehicles.push({ id: 102, type: "metro" });
        this.vehicles.push({ id: 103, type: "tram" });
    }

    // --- Station Operations ---
    async addStation(id: number, name: string): Promise<{ success: boolean; message: string }> {
        this.stations.set(id, name);
        return { success: true, message: "Station added successfully" };
    }

    async getStations(): Promise<{ success: boolean; stations: Station[] }> {
        const stationList: Station[] = Array.from(this.stations.entries()).map(([id, name]) => ({ id, name }));
        return { success: true, stations: stationList };
    }

    async deleteStation(id: number): Promise<{ success: boolean; message: string }> {
        this.stations.delete(id);
        return { success: true, message: "Station deleted successfully" };
    }

    // --- Route Operations ---
    async addRoute(source: number, destination: number, weight: number): Promise<{ success: boolean; message: string }> {
        this.routes.push({ source, destination, weight });
        return { success: true, message: "Route added successfully" };
    }

    async getRoutes(): Promise<{ success: boolean; routes: Route[] }> {
        return { success: true, routes: [...this.routes] };
    }

    // --- Path Finding (Simulation) ---
    async findShortestPath(start: number, end: number): Promise<{ success: boolean; path: Station[]; distance: number }> {
        const startName = this.stations.get(start) || "Unknown";
        const endName = this.stations.get(end) || "Unknown";

        // Simulated path
        const path: Station[] = [
            { id: start, name: startName },
            { id: 1, name: "Central Station" },
            { id: end, name: endName }
        ];

        return {
            success: true,
            path,
            distance: 5 + Math.floor(Math.random() * 15)
        };
    }

    async performBFS(startId: number): Promise<{ success: boolean; traversal: number[] }> {
        // Simulated BFS result
        return { success: true, traversal: [1, 2, 3, 4, 5] };
    }

    // --- Vehicle Operations ---
    async addVehicle(id: number, type: string): Promise<{ success: boolean; message: string }> {
        this.vehicles.push({ id, type });
        return { success: true, message: "Vehicle added successfully" };
    }

    async getVehicles(): Promise<{ success: boolean; vehicles: Vehicle[] }> {
        return { success: true, vehicles: [...this.vehicles] };
    }

    async removeVehicle(id: number): Promise<{ success: boolean; message: string }> {
        this.vehicles = this.vehicles.filter(v => v.id !== id);
        return { success: true, message: "Vehicle removed successfully" };
    }

    // --- Passenger Operations ---
    async addPassenger(id: number, name: string): Promise<{ success: boolean; message: string }> {
        this.passengerQueue.push({ id, name });
        return { success: true, message: "Passenger added to queue" };
    }

    async processPassenger(): Promise<{ success: boolean; message: string }> {
        if (this.passengerQueue.length > 0) {
            this.passengerQueue.shift();
            return { success: true, message: "Passenger processed" };
        }
        return { success: false, message: "Queue is empty" };
    }

    async getPassengerQueue(): Promise<{ success: boolean; queue: Passenger[] }> {
        return { success: true, queue: [...this.passengerQueue] };
    }

    // --- System Status ---
    async getSystemStatus(): Promise<{ success: boolean; status: Omit<SystemStatus, 'connected'> & { uptime: string } }> {
        return {
            success: true,
            status: {
                uptime: "Running (Simulation)",
                stationCount: this.stations.size,
                queueLength: this.passengerQueue.length,
                vehicleCount: this.vehicles.length
            }
        };
    }
}

// Export a singleton instance
export const transportService = new TransportService();
