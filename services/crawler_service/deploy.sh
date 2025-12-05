#!/bin/bash

# Veris Crawler Service - Cloud Run Deployment Script

set -e

echo "🚀 Deploying Veris Crawler Service to Google Cloud Run..."

# Configuration
PROJECT_ID="veris-478615"
REGION="us-central1"
SERVICE_NAME="veris-crawler"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Build Docker image
echo "📦 Building Docker image..."
docker build -t ${IMAGE_NAME}:latest .

# Push to Google Container Registry
echo "⬆️  Pushing to Container Registry..."
docker push ${IMAGE_NAME}:latest

# Deploy to Cloud Run
echo "🌐 Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME}:latest \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --set-env-vars "ADK_AGENT_URL=${ADK_AGENT_URL},RSS_FEEDS=${RSS_FEEDS},REDDIT_SUBREDDITS=${REDDIT_SUBREDDITS}" \
  --memory 512Mi \
  --cpu 1 \
  --timeout 300 \
  --max-instances 10

echo "✅ Deployment complete!"
echo "🔗 Service URL:"
gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format 'value(status.url)'
