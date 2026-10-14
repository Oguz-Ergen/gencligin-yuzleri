#!/usr/bin/env bash
# Siteyi Google Cloud Run'a gönderir. Kullanım: ./deploy.sh <gcp-proje-id> <panel-adresi>
set -euo pipefail
PROJECT="${1:?GCP proje kimliği gerekli}"
CMS_URL="${2:-}"
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
  --set-env-vars "CMS_URL=${CMS_URL}"
