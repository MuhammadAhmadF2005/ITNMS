// Single-header HTTP library for C++
// This is a placeholder - you'll need to download the actual httplib.h
// from: https://github.com/yhirose/cpp-httplib

#ifndef HTTPLIB_H
#define HTTPLIB_H

// Minimal interface for compilation
namespace httplib {
    struct Request {
        std::string body;
        std::vector<std::string> matches;
        std::string get_param_value(const std::string& key) const { return ""; }
    };
    
    struct Response {
        int status = 200;
        void set_content(const std::string& content, const std::string& type) {}
        void set_header(const std::string& key, const std::string& value) {}
    };
    
    class Server {
    public:
        enum HandlerResponse { Unhandled };
        
        void Post(const std::string& pattern, std::function<void(const Request&, Response&)> handler) {}
        void Get(const std::string& pattern, std::function<void(const Request&, Response&)> handler) {}
        void Delete(const std::string& pattern, std::function<void(const Request&, Response&)> handler) {}
        void Put(const std::string& pattern, std::function<void(const Request&, Response&)> handler) {}
        void Options(const std::string& pattern, std::function<void(const Request&, Response&)> handler) {}
        
        void set_pre_routing_handler(std::function<HandlerResponse(const Request&, Response&)> handler) {}
        
        bool listen(const std::string& host, int port) { return true; }
    };
}

#endif