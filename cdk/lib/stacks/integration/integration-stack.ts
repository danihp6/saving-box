import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as path from 'path';
import { fullName } from '../../utils';
import { APP_NAME } from '../../constants';

interface IntegrationStackProps extends cdk.StackProps {
  lambdas: lambda.Function[];
}

export class IntegrationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: IntegrationStackProps) {
    super(scope, id, props);

    const api = new apigateway.SpecRestApi(this, 'api', {
      restApiName: fullName('api'),
      apiDefinition: apigateway.ApiDefinition.fromAsset(path.join('assets', 'api.yaml')),
      deployOptions: {
        stageName: 'dev',
        variables: {
          appName: APP_NAME,
          env: 'dev'
        }
      }
    });

    props.lambdas.forEach(l => {
      l.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'))
    })
  }
}
