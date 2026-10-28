# Roll back a deployment

Deployments are made by the `Deploy Astro Static and SSR Sites via AWS CDK`
workflow. The workflow supports both normal pushes to `main` and manual
deployments of a specific commit or tag.

## Rollback procedure

1. Open the repository's **Actions** tab.
2. Select **Deploy Astro Static and SSR Sites via AWS CDK**.
3. Select **Run workflow**.
4. Enter the commit SHA or tag for the last known-good version in
   **Commit SHA or tag to deploy**.
5. Start the workflow and wait for all steps to complete.
6. Open the deployed URL from the workflow summary and verify
   `/api/health` returns HTTP 200.

The selected revision is used to build both the ECS/Fargate SSR image and the
static CloudFront/S3 site, so the two deployments roll back together.

Before deploying a rollback, confirm that the selected revision contains the
same infrastructure configuration expected by the current AWS environment.
