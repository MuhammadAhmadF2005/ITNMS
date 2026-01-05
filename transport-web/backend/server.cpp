#include <iostream>
#include <string>
#include <sstream>
#include <thread>
#include <chrono>
#include <functional>
#include <vector>
#include "httplib.h"
#include "json.hpp"

// Include your DSA project headers
#include "../../DSA_project/src/CityGraph.h"
#include "../../DSA_project/src/VehicleMap.h"
#include "../../DSA_project/src/CoreDS.h"
#include "../../DSA_project/src/Analytics.h"
#include "../../DSA_project/src/Tree.h"
#include "../../DSA_project/src/Heap.h"

using json = nlohmann::json;
using namespace std;

// Global instances
CityGraph city;
PassengerQueue pQueue;
VehicleHashTable vTable;
HistoryStack history;
BST bst;
MinHeap heap(100);
Analytics analytics;

class TransportAPI {
public:
    static void setupRoutes(httplib::Server& server) {
        // Enable CORS
        server.set_pre_routing_handler([](const httplib::Request& req, httplib::Response& res) {
            res.set_header("Access-Control-Allow-Origin", "*");
            res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
            return httplib::Server::HandlerResponse::Unhandled;
        });

        // Handle OPTIONS requests
        server.Options(".*", [](const httplib::Request&, httplib::Response& res) {
            return;
        });

        // Station endpoints
        server.Post("/api/stations", addStation);
        server.Get("/api/stations", getStations);
        server.Delete("/api/stations/(\\d+)", deleteStation);

        // Route endpoints
        server.Post("/api/routes", addRoute);
        server.Delete("/api/routes", deleteRoute);

        // Path finding
        server.Get("/api/shortest-path", findShortestPath);
        server.Get("/api/bfs/(\\d+)", performBFS);
        server.Get("/api/dfs/(\\d+)", performDFS);

        // Passenger queue
        server.Post("/api/passengers", addPassenger);
        server.Delete("/api/passengers", processPassenger);
        server.Get("/api/passengers", getPassengerQueue);

        // Vehicle management
        server.Post("/api/vehicles", addVehicle);
        server.Get("/api/vehicles/(\\d+)", searchVehicle);
        server.Delete("/api/vehicles/(\\d+)", removeVehicle);

        // Analytics
        server.Get("/api/analytics/stations", getStationAnalytics);
        server.Get("/api/analytics/routes", getRouteAnalytics);
        server.Post("/api/analytics/visit", recordStationVisit);

        // System status
        server.Get("/api/status", getSystemStatus);
    }

private:
    static void addStation(const httplib::Request& req, httplib::Response& res) {
        try {
            json body = json::parse(req.body);
            int id = body["id"];
            string name = body["name"];
            
            city.addStation(id, name);
            history.push("ADD_STATION", id);
            
            json response = {{"success", true}, {"message", "Station added successfully"}};
            res.set_content(response.dump(), "application/json");
        } catch (const exception& e) {
            json error = {{"success", false}, {"error", e.what()}};
            res.status = 400;
            res.set_content(error.dump(), "application/json");
        }
    }

    static void getStations(const httplib::Request& req, httplib::Response& res) {
        json stations = json::array();
        
        // This would need to be implemented in CityGraph to return station data
        // For now, return a sample response
        json response = {
            {"success", true},
            {"stations", stations}
        };
        
        res.set_content(response.dump(), "application/json");
    }

    static void deleteStation(const httplib::Request& req, httplib::Response& res) {
        try {
            int id = stoi(req.matches[1]);
            city.deleteStation(id);
            history.push("DELETE_STATION", id);
            
            json response = {{"success", true}, {"message", "Station deleted successfully"}};
            res.set_content(response.dump(), "application/json");
        } catch (const exception& e) {
            json error = {{"success", false}, {"error", e.what()}};
            res.status = 400;
            res.set_content(error.dump(), "application/json");
        }
    }

    static void addRoute(const httplib::Request& req, httplib::Response& res) {
        try {
            json body = json::parse(req.body);
            int src = body["source"];
            int dest = body["destination"];
            int weight = body["weight"];
            
            city.addRoute(src, dest, weight);
            history.push("ADD_ROUTE", src);
            
            json response = {{"success", true}, {"message", "Route added successfully"}};
            res.set_content(response.dump(), "application/json");
        } catch (const exception& e) {
            json error = {{"success", false}, {"error", e.what()}};
            res.status = 400;
            res.set_content(error.dump(), "application/json");
        }
    }

    static void deleteRoute(const httplib::Request& req, httplib::Response& res) {
        try {
            json body = json::parse(req.body);
            int src = body["source"];
            int dest = body["destination"];
            
            city.deleteRoute(src, dest);
            history.push("DELETE_ROUTE", src);
            
            json response = {{"success", true}, {"message", "Route deleted successfully"}};
            res.set_content(response.dump(), "application/json");
        } catch (const exception& e) {
            json error = {{"success", false}, {"error", e.what()}};
            res.status = 400;
            res.set_content(error.dump(), "application/json");
        }
    }

    static void findShortestPath(const httplib::Request& req, httplib::Response& res) {
        try {
            int start = stoi(req.get_param_value("start"));
            int end = stoi(req.get_param_value("end"));
            
            // This would need modification to CityGraph to return path data
            // For now, return a sample response
            json response = {
                {"success", true},
                {"path", json::array()},
                {"distance", 0}
            };
            
            res.set_content(response.dump(), "application/json");
        } catch (const exception& e) {
            json error = {{"success", false}, {"error", e.what()}};
            res.status = 400;
            res.set_content(error.dump(), "application/json");
        }
    }

    static void performBFS(const httplib::Request& req, httplib::Response& res) {
        try {
            int start = stoi(req.matches[1]);
            
            // This would need modification to return traversal data
            json response = {
                {"success", true},
                {"traversal", json::array()}
            };
            
            res.set_content(response.dump(), "application/json");
        } catch (const exception& e) {
            json error = {{"success", false}, {"error", e.what()}};
            res.status = 400;
            res.set_content(error.dump(), "application/json");
        }
    }

    static void performDFS(const httplib::Request& req, httplib::Response& res) {
        try {
            int start = stoi(req.matches[1]);
            
            // This would need modification to return traversal data
            json response = {
                {"success", true},
                {"traversal", json::array()}
            };
            
            res.set_content(response.dump(), "application/json");
        } catch (const exception& e) {
            json error = {{"success", false}, {"error", e.what()}};
            res.status = 400;
            res.set_content(error.dump(), "application/json");
        }
    }

    static void addPassenger(const httplib::Request& req, httplib::Response& res) {
        try {
            json body = json::parse(req.body);
            int id = body["id"];
            string name = body["name"];
            
            pQueue.enqueue(id, name);
            
            json response = {{"success", true}, {"message", "Passenger added to queue"}};
            res.set_content(response.dump(), "application/json");
        } catch (const exception& e) {
            json error = {{"success", false}, {"error", e.what()}};
            res.status = 400;
            res.set_content(error.dump(), "application/json");
        }
    }

    static void processPassenger(const httplib::Request& req, httplib::Response& res) {
        try {
            pQueue.dequeue();
            
            json response = {{"success", true}, {"message", "Passenger processed"}};
            res.set_content(response.dump(), "application/json");
        } catch (const exception& e) {
            json error = {{"success", false}, {"error", e.what()}};
            res.status = 400;
            res.set_content(error.dump(), "application/json");
        }
    }

    static void getPassengerQueue(const httplib::Request& req, httplib::Response& res) {
        // This would need modification to return queue data
        json response = {
            {"success", true},
            {"queue", json::array()}
        };
        
        res.set_content(response.dump(), "application/json");
    }

    static void addVehicle(const httplib::Request& req, httplib::Response& res) {
        try {
            json body = json::parse(req.body);
            int id = body["id"];
            string type = body["type"];
            
            vTable.insert(id, type);
            
            json response = {{"success", true}, {"message", "Vehicle added successfully"}};
            res.set_content(response.dump(), "application/json");
        } catch (const exception& e) {
            json error = {{"success", false}, {"error", e.what()}};
            res.status = 400;
            res.set_content(error.dump(), "application/json");
        }
    }

    static void searchVehicle(const httplib::Request& req, httplib::Response& res) {
        try {
            int id = stoi(req.matches[1]);
            
            // This would need modification to return vehicle data
            json response = {
                {"success", true},
                {"vehicle", nullptr}
            };
            
            res.set_content(response.dump(), "application/json");
        } catch (const exception& e) {
            json error = {{"success", false}, {"error", e.what()}};
            res.status = 400;
            res.set_content(error.dump(), "application/json");
        }
    }

    static void removeVehicle(const httplib::Request& req, httplib::Response& res) {
        try {
            int id = stoi(req.matches[1]);
            vTable.remove(id);
            
            json response = {{"success", true}, {"message", "Vehicle removed successfully"}};
            res.set_content(response.dump(), "application/json");
        } catch (const exception& e) {
            json error = {{"success", false}, {"error", e.what()}};
            res.status = 400;
            res.set_content(error.dump(), "application/json");
        }
    }

    static void getStationAnalytics(const httplib::Request& req, httplib::Response& res) {
        json response = {
            {"success", true},
            {"analytics", {
                {"mostCrowded", nullptr},
                {"frequencies", json::array()}
            }}
        };
        
        res.set_content(response.dump(), "application/json");
    }

    static void getRouteAnalytics(const httplib::Request& req, httplib::Response& res) {
        json response = {
            {"success", true},
            {"analytics", {
                {"busiestRoute", nullptr},
                {"routeWeights", json::array()}
            }}
        };
        
        res.set_content(response.dump(), "application/json");
    }

    static void recordStationVisit(const httplib::Request& req, httplib::Response& res) {
        try {
            json body = json::parse(req.body);
            int stationId = body["stationId"];
            
            analytics.recordStationVisit(stationId);
            
            json response = {{"success", true}, {"message", "Visit recorded"}};
            res.set_content(response.dump(), "application/json");
        } catch (const exception& e) {
            json error = {{"success", false}, {"error", e.what()}};
            res.status = 400;
            res.set_content(error.dump(), "application/json");
        }
    }

    static void getSystemStatus(const httplib::Request& req, httplib::Response& res) {
        json response = {
            {"success", true},
            {"status", {
                {"uptime", "Running"},
                {"stationCount", 0},
                {"queueLength", 0},
                {"vehicleCount", 0}
            }}
        };
        
        res.set_content(response.dump(), "application/json");
    }
};

int main() {
    httplib::Server server;
    
    TransportAPI::setupRoutes(server);
    
    cout << "🚇 Transport API Server starting on http://localhost:8080" << endl;
    cout << "Press Ctrl+C to stop the server" << endl;
    
    server.listen("0.0.0.0", 8080);
    
    return 0;
}