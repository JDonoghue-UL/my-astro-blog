import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecrAssets from 'aws-cdk-lib/aws-ecr-assets';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export class StaticSiteStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'SiteVpc', {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });
    const cluster = new ecs.Cluster(this, 'SiteCluster', { vpc });
    const image = new ecrAssets.DockerImageAsset(this, 'SiteImage', {
      directory: '..',
    });
    const service = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'SiteService', {
      cluster,
      cpu: 256,
      memoryLimitMiB: 512,
      desiredCount: 1,
      publicLoadBalancer: true,
      assignPublicIp: true,
      taskSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      taskImageOptions: {
        image: ecs.ContainerImage.fromDockerImageAsset(image),
        containerPort: 8080,
        environment: {
          HOST: '0.0.0.0',
          PORT: '8080',
        },
      },
    });

    service.targetGroup.configureHealthCheck({
      path: '/api/health',
      healthyHttpCodes: '200',
    });

    const staticBucket = new s3.Bucket(this, 'StaticSiteBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
    });
    const staticDistribution = new cloudfront.Distribution(this, 'StaticSiteDistribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(staticBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
    });
    new s3deploy.BucketDeployment(this, 'StaticSiteDeployment', {
      sources: [s3deploy.Source.asset('../dist-static')],
      destinationBucket: staticBucket,
      distribution: staticDistribution,
      distributionPaths: ['/*'],
    });

    new cdk.CfnOutput(this, 'SiteUrl', {
      value: `http://${service.loadBalancer.loadBalancerDnsName}`,
      description: 'Load balancer URL for the deployed Astro SSR site',
    });
    new cdk.CfnOutput(this, 'StaticSiteUrl', {
      value: `https://${staticDistribution.distributionDomainName}`,
      description: 'CloudFront URL for the deployed static Astro site',
    });
  }
}
