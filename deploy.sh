#!/bin/bash

set -e  # automatikusan kilép bármilyen hiba esetén

# Színes output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Mokasfoci React App Deployment ===${NC}\n"

# 0. Bump version
echo -e "${YELLOW}[0/3] Bumping version...${NC}"
VERSION_FILE="public/version.json"
CURRENT_VERSION=$(jq -r '.version' $VERSION_FILE)
IFS='.' read -r -a VERSION_PARTS <<< "$CURRENT_VERSION"
VERSION_PARTS[2]=$((VERSION_PARTS[2] + 1))
NEW_VERSION="${VERSION_PARTS[0]}.${VERSION_PARTS[1]}.${VERSION_PARTS[2]}"
BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")
jq --arg version "$NEW_VERSION" --arg date "$BUILD_DATE" '.version = $version | .buildDate = $date' $VERSION_FILE > tmp.json && mv tmp.json $VERSION_FILE
echo -e "${GREEN}✓ Version bumped to $NEW_VERSION${NC}\n"

# 1. Build
echo -e "${YELLOW}[1/3] Building project...${NC}"
npm run build
echo -e "${GREEN}✓ Build completed${NC}\n"

# 2. Deploy
echo -e "${YELLOW}[2/3] Deploying to Raspberry Pi...${NC}"
rsync -rlvz --delete --progress --no-times ./dist/ dietpi@192.168.1.110:/var/www/WorldCup26/
echo -e "${GREEN}✓ Files deployed${NC}\n"

# 3. Commit version
echo -e "${YELLOW}[3/3] Committing version update...${NC}"
git add $VERSION_FILE
git commit -m "chore: bump version to $NEW_VERSION" || echo -e "${YELLOW}⚠ No changes to commit${NC}"
# git push  # Uncomment to auto-push to remote
echo -e "${GREEN}✓ Version committed${NC}\n"

echo -e "\n${GREEN}==================================${NC}"
echo -e "${GREEN}✓ Deployment completed successfully!${NC}"
echo -e "${GREEN}Version: $NEW_VERSION${NC}"
echo -e "${GREEN}==================================${NC}\n"
