# Veris Crawler Service - Cloud Run Deployment Script (Windows)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Deploying Veris Crawler Service to Google Cloud Run..." -ForegroundColor Green

# Configuration
$PROJECT_ID = "your-project-id"
$REGION = "us-central1"
$SERVICE_NAME = "veris-crawler"
$IMAGE_NAME = "gcr.io/$PROJECT_ID/$SERVICE_NAME"

# Load environment variables from .env
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2])
        }
    }
}

# Build Docker image
Write-Host "📦 Building Docker image..." -ForegroundColor Cyan
docker build -t "${IMAGE_NAME}:latest" .

# Push to Google Container Registry
Write-Host "⬆️  Pushing to Container Registry..." -ForegroundColor Cyan
docker push "${IMAGE_NAME}:latest"

# Deploy to Cloud Run
Write-Host "🌐 Deploying to Cloud Run..." -ForegroundColor Cyan
gcloud run deploy $SERVICE_NAME `
  --image "${IMAGE_NAME}:latest" `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated `
  --set-env-vars "PORT=3000,ADK_AGENT_URL=$env:ADK_AGENT_URL,RSS_FEEDS=$env:RSS_FEEDS,REDDIT_SUBREDDITS=$env:REDDIT_SUBREDDITS" `
  --memory 512Mi `
  --cpu 1 `
  --timeout 300 `
  --max-instances 10

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🔗 Service URL:" -ForegroundColor Yellow
gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)'
