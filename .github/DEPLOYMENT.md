# CI/CD Deployment Guide

This document provides comprehensive instructions for setting up and using the GitHub Actions CI/CD pipeline to deploy the Travel Journal application to AWS S3.

## Table of Contents

- [Overview](#overview)
- [Pipeline Architecture](#pipeline-architecture)
- [Prerequisites](#prerequisites)
- [AWS Setup](#aws-setup)
- [GitHub Configuration](#github-configuration)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)

---

## Overview

The CI/CD pipeline automates the following processes:

1. **Continuous Integration (CI)**
   - Runs ESLint for code quality checks
   - Executes test suite with coverage reports
   - Builds the production-ready application

2. **Continuous Deployment (CD)**
   - Deploys to **Staging** environment from the `develop` branch
   - Deploys to **Production** environment from the `main` branch
   - Supports manual deployments via workflow dispatch

---

## Pipeline Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────────────┐
│   Push/PR to    │────▶│   Test & Lint   │────▶│    Build Application    │
│  main/develop   │     │                 │     │                         │
└─────────────────┘     └─────────────────┘     └───────────┬─────────────┘
                                                            │
                        ┌───────────────────────────────────┴───────────────────────────────────┐
                        │                                                                       │
                        ▼                                                                       ▼
          ┌─────────────────────────┐                                         ┌─────────────────────────┐
          │   Deploy to Staging     │                                         │  Deploy to Production   │
          │   (develop branch)      │                                         │   (main branch)         │
          │                         │                                         │                         │
          │   ┌─────────────────┐   │                                         │   ┌─────────────────┐   │
          │   │    S3 Bucket    │   │                                         │   │    S3 Bucket    │   │
          │   │    (Staging)    │   │                                         │   │  (Production)   │   │
          │   └────────┬────────┘   │                                         │   └────────┬────────┘   │
          │            │            │                                         │            │            │
          │            ▼            │                                         │            ▼            │
          │   ┌─────────────────┐   │                                         │   ┌─────────────────┐   │
          │   │   CloudFront    │   │                                         │   │   CloudFront    │   │
          │   │   (Optional)    │   │                                         │   │   (Optional)    │   │
          │   └─────────────────┘   │                                         │   └─────────────────┘   │
          └─────────────────────────┘                                         └─────────────────────────┘
```

---

## Prerequisites

Before setting up the pipeline, ensure you have:

- An AWS account with appropriate permissions
- A GitHub repository with the Travel Journal code
- AWS CLI installed locally (for initial setup)
- Node.js 18+ installed locally (for testing)

---

## AWS Setup

### 1. Create S3 Buckets

Create two S3 buckets for staging and production environments:

```bash
# Create staging bucket
aws s3 mb s3://your-app-staging --region us-east-1

# Create production bucket
aws s3 mb s3://your-app-production --region us-east-1
```

### 2. Configure S3 for Static Website Hosting

For each bucket, enable static website hosting:

```bash
# Enable static website hosting
aws s3 website s3://your-app-staging \
  --index-document index.html \
  --error-document index.html

aws s3 website s3://your-app-production \
  --index-document index.html \
  --error-document index.html
```

### 3. Set Bucket Policy for Public Access

Create a bucket policy file (`bucket-policy.json`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

Apply the policy:

```bash
aws s3api put-bucket-policy \
  --bucket your-app-staging \
  --policy file://bucket-policy.json

aws s3api put-bucket-policy \
  --bucket your-app-production \
  --policy file://bucket-policy.json
```

> **Note:** If using CloudFront, you can restrict S3 access to CloudFront only using Origin Access Control (OAC).

### 4. Create IAM User for GitHub Actions

Create an IAM user with programmatic access:

```bash
aws iam create-user --user-name github-actions-deploy
```

Create and attach a policy (`github-actions-policy.json`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3DeployAccess",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:PutObjectAcl"
      ],
      "Resource": [
        "arn:aws:s3:::your-app-staging",
        "arn:aws:s3:::your-app-staging/*",
        "arn:aws:s3:::your-app-production",
        "arn:aws:s3:::your-app-production/*"
      ]
    },
    {
      "Sid": "CloudFrontInvalidation",
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation",
        "cloudfront:ListInvalidations"
      ],
      "Resource": "*"
    }
  ]
}
```

```bash
aws iam put-user-policy \
  --user-name github-actions-deploy \
  --policy-name S3DeployPolicy \
  --policy-document file://github-actions-policy.json
```

Generate access keys:

```bash
aws iam create-access-key --user-name github-actions-deploy
```

> **Important:** Save the `AccessKeyId` and `SecretAccessKey` securely. You'll need them for GitHub secrets.

### 5. (Optional) Set Up CloudFront Distribution

For better performance and HTTPS support, create a CloudFront distribution:

```bash
aws cloudfront create-distribution \
  --origin-domain-name your-app-production.s3.amazonaws.com \
  --default-root-object index.html
```

Configure custom error responses for SPA routing:

- Error Code: 403, 404
- Response Page Path: /index.html
- Response Code: 200

---

## GitHub Configuration

### Repository Secrets

Navigate to **Settings → Secrets and variables → Actions → Secrets** and add:

| Secret Name | Description |
|-------------|-------------|
| `AWS_ACCESS_KEY_ID` | IAM user access key ID |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret access key |

### Repository Variables

Navigate to **Settings → Secrets and variables → Actions → Variables** and add:

| Variable Name | Description | Example |
|---------------|-------------|---------|
| `AWS_REGION` | AWS region for deployment | `us-east-1` |
| `S3_BUCKET_STAGING` | Staging S3 bucket name | `travel-journal-staging` |
| `S3_BUCKET_PRODUCTION` | Production S3 bucket name | `travel-journal-prod` |
| `STAGING_URL` | Staging environment URL | `https://staging.example.com` |
| `PRODUCTION_URL` | Production environment URL | `https://example.com` |
| `CLOUDFRONT_DISTRIBUTION_ID_STAGING` | (Optional) Staging CloudFront ID | `E1234567890ABC` |
| `CLOUDFRONT_DISTRIBUTION_ID_PRODUCTION` | (Optional) Production CloudFront ID | `E0987654321XYZ` |

### Environment Protection Rules

For additional security, configure environment protection rules:

1. Go to **Settings → Environments**
2. Create `staging` and `production` environments
3. For `production`, enable:
   - **Required reviewers**: Add team members who must approve deployments
   - **Wait timer**: Add a delay before deployment (optional)
   - **Deployment branches**: Restrict to `main` branch only

---

## Usage

### Automatic Deployments

| Trigger | Action |
|---------|--------|
| Push to `develop` | Deploys to staging |
| Push to `main` | Deploys to production |
| Pull request to `main`/`develop` | Runs tests only (no deployment) |

### Manual Deployments

1. Go to **Actions** tab in your repository
2. Select **CI/CD Pipeline - Deploy to AWS S3**
3. Click **Run workflow**
4. Select the environment (staging/production)
5. Click **Run workflow**

### Monitoring Deployments

- View deployment status in the **Actions** tab
- Check deployment summaries for each run
- Review the **Environments** page for deployment history

---

## Troubleshooting

### Common Issues

#### 1. Access Denied Errors

**Symptom:** `AccessDenied` error when deploying to S3

**Solutions:**
- Verify IAM user has correct permissions
- Check bucket policy allows the IAM user
- Ensure bucket name is correct in variables

#### 2. Build Failures

**Symptom:** Build step fails with dependency errors

**Solutions:**
- Check `package-lock.json` is committed
- Verify Node.js version matches project requirements
- Clear npm cache: `npm cache clean --force`

#### 3. Test Failures

**Symptom:** Tests pass locally but fail in CI

**Solutions:**
- Ensure all test dependencies are in `devDependencies`
- Check for timezone-dependent tests
- Verify environment variables are set correctly

#### 4. CloudFront Invalidation Fails

**Symptom:** `AccessDenied` when invalidating CloudFront cache

**Solutions:**
- Verify IAM user has `cloudfront:CreateInvalidation` permission
- Check CloudFront distribution ID is correct
- Ensure the variable is set (empty = step is skipped)

#### 5. SPA Routing Issues

**Symptom:** 404 errors when accessing routes directly

**Solutions:**
- Configure S3 error document to `index.html`
- Set up CloudFront custom error responses
- Ensure `index.html` has correct cache headers

### Viewing Logs

1. Go to **Actions** tab
2. Click on the failed workflow run
3. Expand the failed step to view detailed logs

### Rollback Procedure

To rollback to a previous deployment:

1. Find the last successful deployment in **Actions**
2. Click **Re-run all jobs**

Or manually deploy a specific commit:

```bash
# Checkout the specific commit
git checkout <commit-sha>

# Build locally
npm run build

# Deploy manually using AWS CLI
aws s3 sync dist/ s3://your-bucket-name --delete
```

---

## Security Best Practices

1. **Never commit AWS credentials** - Always use GitHub Secrets
2. **Use least privilege** - Only grant necessary IAM permissions
3. **Enable MFA** - Require MFA for AWS console access
4. **Rotate credentials** - Periodically rotate IAM access keys
5. **Use environment protection** - Require approvals for production deployments
6. **Enable S3 versioning** - Allow rollback of deployed files
7. **Use CloudFront with HTTPS** - Encrypt data in transit

---

## Additional Resources

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

## Support

If you encounter issues not covered in this guide:

1. Check the [GitHub Issues](https://github.com/Ethara-AI/travel-journal-react/issues)
2. Review AWS CloudWatch logs for detailed error information
3. Open a new issue with detailed reproduction steps