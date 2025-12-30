CXX = g++
CXXFLAGS = -std=c++17 -pthread -O2 -Wall
TARGET = transport-api
SOURCES = server.cpp

# Include paths
INCLUDES = -I. -I../DSA_project/src

all: $(TARGET)

$(TARGET): $(SOURCES)
	$(CXX) $(CXXFLAGS) $(INCLUDES) $(SOURCES) -o $(TARGET)

clean:
	rm -f $(TARGET)

install-deps:
	@echo "Downloading dependencies..."
	@curl -L https://raw.githubusercontent.com/yhirose/cpp-httplib/master/httplib.h -o httplib.h
	@curl -L https://raw.githubusercontent.com/nlohmann/json/develop/single_include/nlohmann/json.hpp -o json.hpp
	@echo "Dependencies downloaded!"

run: $(TARGET)
	./$(TARGET)

.PHONY: all clean install-deps run