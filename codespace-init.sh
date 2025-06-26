set -e

echo "🔐 Authenticating to Google Cloud via Workload Identity Federation..."

gcloud auth workload-identity-federation login \
  --workload-identity-provider="projects/826773862580/locations/global/workloadIdentityPools/github/providers/github" \
  --subject="repo:Outsource-Vertical/SelahGPT:ref:refs/heads/main" \
  --impersonate-service-account="firebase-deployer@selahgpt.iam.gserviceaccount.com"

echo "✅ Auth complete. You can now run: firebase deploy --only functions"
