adk deploy cloud_run \
  --project=veris-478615 \
  --region=us-central1 \
  --service_name=veris-ai \
  --app_name=veris_agent \
  --with_ui \
  --allow_origins=https://veris.luex.shop \
  .

gcloud run deploy veris-web \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated

gcloud run deploy veris-crawler \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated

gsutil cors set cors.json gs://veris-media

