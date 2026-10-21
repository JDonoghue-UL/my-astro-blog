# Astro SSR deployment

The Astro app uses the Node adapter in standalone mode. This stack builds the
root `Dockerfile`, runs it on ECS Fargate, and exposes it through a public
Application Load Balancer. The `/api/health` route is used as the target health
check.

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   type-check the project
* `npm run watch`   watch for changes and type-check
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  build the container and deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
