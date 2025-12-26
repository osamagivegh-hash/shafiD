# Shafi Store - Google Cloud Deployment Guide

## Prerequisites

1. **Google Cloud Account** with billing enabled
2. **Google Cloud CLI (gcloud)** installed
3. **Docker Desktop** installed and running

## Setup Steps

### 1. Install Google Cloud CLI

Download and install from: https://cloud.google.com/sdk/docs/install

### 2. Login and Configure Project

```bash
# Login to Google Cloud
gcloud auth login

# Create a new project (or use existing)
gcloud projects create shafi-store --name="Shafi Store"

# Set the project
gcloud config set project shafi-store

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 3. Configure Environment Variables

Create a `.env.production` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=dlsobyta0
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Deploy Using Cloud Build

#### Option A: Automatic Deployment (Recommended)

```bash
# Submit build to Cloud Build
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions=_MONGO_URI="your_mongo_uri",_CLOUDINARY_API_KEY="your_key",_CLOUDINARY_API_SECRET="your_secret"
```

#### Option B: Manual Docker Deployment

```bash
# Build and push backend
cd backend
docker build -t gcr.io/shafi-store/shafi-backend:latest .
docker push gcr.io/shafi-store/shafi-backend:latest

# Deploy backend to Cloud Run
gcloud run deploy shafi-backend \
  --image gcr.io/shafi-store/shafi-backend:latest \
  --platform managed \
  --region me-west1 \
  --allow-unauthenticated \
  --port 4000 \
  --set-env-vars "MONGO_URI=your_uri,CLOUDINARY_CLOUD_NAME=dlsobyta0,CLOUDINARY_API_KEY=key,CLOUDINARY_API_SECRET=secret"

# Get backend URL
BACKEND_URL=$(gcloud run services describe shafi-backend --region me-west1 --format='value(status.url)')

# Build and push frontend
cd ../frontend
docker build -t gcr.io/shafi-store/shafi-frontend:latest \
  --build-arg NEXT_PUBLIC_API_URL="${BACKEND_URL}/api/v1" .
docker push gcr.io/shafi-store/shafi-frontend:latest

# Deploy frontend to Cloud Run
gcloud run deploy shafi-frontend \
  --image gcr.io/shafi-store/shafi-frontend:latest \
  --platform managed \
  --region me-west1 \
  --allow-unauthenticated \
  --port 3000
```

### 5. Configure Custom Domain (Optional)

```bash
# Map custom domain
gcloud run domain-mappings create --service shafi-frontend --domain your-domain.com --region me-west1

# Follow DNS instructions provided by Google Cloud
```

## Environment Variables Reference

### Backend (.env)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 4000) |
| `MONGO_URI` | MongoDB connection string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Frontend
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL |

## Local Docker Testing

Before deploying, test locally:

```bash
# From project root
docker-compose up --build

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:4000
```

## Troubleshooting

### Build Fails
- Check Docker is running
- Verify all dependencies are in package.json
- Check for syntax errors in Dockerfiles

### Container Crashes
- Check Cloud Run logs: `gcloud run logs read --service shafi-backend`
- Verify environment variables are set correctly

### CORS Issues
- Ensure backend CORS is configured to allow frontend domain
- Update backend `server.js` to include Cloud Run URLs

## Estimated Costs

Cloud Run pricing (as of 2024):
- **Free tier**: 2 million requests/month
- **CPU**: $0.00002400/vCPU-second
- **Memory**: $0.00000250/GiB-second

For a small store, expect ~$5-20/month depending on traffic.

## Support

For issues, check:
- Google Cloud Console: https://console.cloud.google.com
- Cloud Run Dashboard: https://console.cloud.google.com/run
