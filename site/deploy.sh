#!/usr/bin/env bash
# Siteyi Google Cloud Run'a gönderir. Kullanım: ./deploy.sh <gcp-proje-id> <sanity-proje-id>
set -euo pipefail
PROJECT="${1:?GCP proje kimliği gerekli}"
SANITY_ID="${2:-}"
REGION="europe-west1"
SERVICE="gencligin-yuzleri"

gcloud run deploy "$SERVICE" \
  --project "$PROJECT" \
  --region "$REGION" \
  --source . \
  --allow-unauthenticated \
  --memory 512Mi \
  --min-instances 0 \
  --max-instances 4 \
  --set-env-vars "SANITY_PROJECT_ID=${SANITY_ID},SANITY_DATASET=production"
