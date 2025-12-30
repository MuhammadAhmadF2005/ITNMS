// JSON for Modern C++ placeholder
// Download the actual nlohmann/json from: https://github.com/nlohmann/json

#ifndef JSON_HPP
#define JSON_HPP

#include <string>
#include <vector>
#include <map>

namespace nlohmann {
    class json {
    public:
        static json array() { return json(); }
        static json parse(const std::string& str) { return json(); }
        
        json& operator[](const std::string& key) { return *this; }
        json& operator[](int index) { return *this; }
        
        operator int() const { return 0; }
        operator std::string() const { return ""; }
        
        std::string dump() const { return "{}"; }
        
        // Assignment operators
        json& operator=(int value) { return *this; }
        json& operator=(const std::string& value) { return *this; }
        json& operator=(bool value) { return *this; }
        json& operator=(const json& other) { return *this; }
    };
}

#endif