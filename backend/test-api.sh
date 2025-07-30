#!/bin/bash

# Quick API Test Script for Thmanyah Backend
echo "🧪 Testing Thmanyah Backend API..."

BASE_URL="http://localhost:3000/api"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -e "\n${YELLOW}Testing: $description${NC}"
    echo "Method: $method"
    echo "Endpoint: $BASE_URL$endpoint"
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    else
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint")
    fi
    
    # Split response and status code
    body=$(echo "$response" | head -n -1)
    status_code=$(echo "$response" | tail -n 1)
    
    if [ "$status_code" -eq 200 ] || [ "$status_code" -eq 201 ]; then
        echo -e "${GREEN}✅ Success (Status: $status_code)${NC}"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    else
        echo -e "${RED}❌ Failed (Status: $status_code)${NC}"
        echo "$body"
    fi
}

# Check if server is running
echo "🔍 Checking if server is running..."
if ! curl -s "$BASE_URL/health" > /dev/null; then
    echo -e "${RED}❌ Server is not running at $BASE_URL${NC}"
    echo "Please start the server with: npm run start:dev"
    exit 1
fi

echo -e "${GREEN}✅ Server is running${NC}"

# Test endpoints
test_endpoint "GET" "/" "Root endpoint"
test_endpoint "GET" "/health" "Health check"
test_endpoint "GET" "/docs/examples" "API documentation examples"
test_endpoint "GET" "/docs/schema" "Podcast schema documentation"

echo -e "\n${YELLOW}📝 Database-dependent endpoints (require PostgreSQL):${NC}"
echo "POST $BASE_URL/podcasts/search - Search and store podcasts"
echo "GET  $BASE_URL/podcasts - Get all stored podcasts"
echo "GET  $BASE_URL/podcasts/:id - Get specific podcast"

echo -e "\n${YELLOW}🧪 Example search request:${NC}"
echo "curl -X POST $BASE_URL/podcasts/search \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"term\": \"فنجان\"}'"

echo -e "\n${GREEN}✅ API testing completed!${NC}"
