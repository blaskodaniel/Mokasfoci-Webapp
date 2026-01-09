#!/bin/bash

set -e  # automatikusan kilép bármilyen hiba esetén

# Színes output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Mokasfoci React App Deployment ===${NC}\n"

# 1. Build
echo -e "${YELLOW}[1/2] Building project...${NC}"
npm run build
echo -e "${GREEN}✓ Build completed${NC}\n"

# 2. Deploy
echo -e "${YELLOW}[2/2] Deploying to Raspberry Pi...${NC}"
rsync -rlvz --delete --progress --no-times ./dist/ dietpi@192.168.1.110:/var/www/WorldCup26/
echo -e "${GREEN}✓ Files deployed${NC}\n"

echo -e "\n${GREEN}==================================${NC}"
echo -e "${GREEN}✓ Deployment completed successfully!${NC}"
echo -e "${GREEN}==================================${NC}\n"
