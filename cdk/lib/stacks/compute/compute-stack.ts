import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdanodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';
import { fullName } from '../../utils';
import { BOXES_TABLE_NAME } from '../../constants';

export class ComputeStack extends cdk.Stack {
  lambdas: lambda.Function[] = [];

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const boxesTableName = fullName(BOXES_TABLE_NAME);

    const addBox = new lambdanodejs.NodejsFunction(this, 'add-box', {
      functionName: fullName('add-box'),
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: 'lib/lambdas/add-box/index.ts',
      environment: {
        BOXES_TABLE_NAME: boxesTableName
      },
      initialPolicy: [
        new iam.PolicyStatement({
          actions: ['dynamodb:PutItem'],
          effect: iam.Effect.ALLOW,
          resources: [`arn:aws:dynamodb:${this.region}:${this.account}:table/${boxesTableName}`]
        })
      ]
    });

    const deleteBox = new lambdanodejs.NodejsFunction(this, 'delete-box', {
      functionName: fullName('delete-box'),
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: 'lib/lambdas/delete-box/index.ts',
      environment: {
        BOXES_TABLE_NAME: boxesTableName
      },
      initialPolicy: [
        new iam.PolicyStatement({
          actions: ['dynamodb:DeleteItem'],
          effect: iam.Effect.ALLOW,
          resources: [`arn:aws:dynamodb:${this.region}:${this.account}:table/${boxesTableName}`]
        })
      ]
    });

    const updateBox = new lambdanodejs.NodejsFunction(this, 'update-box', {
      functionName: fullName('update-box'),
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: 'lib/lambdas/update-box/index.ts',
      environment: {
        BOXES_TABLE_NAME: boxesTableName
      },
      initialPolicy: [
        new iam.PolicyStatement({
          actions: ['dynamodb:UpdateItem'],
          effect: iam.Effect.ALLOW,
          resources: [`arn:aws:dynamodb:${this.region}:${this.account}:table/${boxesTableName}`]
        })
      ]
    });

    const getBox = new lambdanodejs.NodejsFunction(this, 'get-box', {
      functionName: fullName('get-box'),
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: 'lib/lambdas/get-box/index.ts',
      environment: {
        BOXES_TABLE_NAME: boxesTableName
      },
      initialPolicy: [
        new iam.PolicyStatement({
          actions: ['dynamodb:GetItem'],
          effect: iam.Effect.ALLOW,
          resources: [`arn:aws:dynamodb:${this.region}:${this.account}:table/${boxesTableName}`]
        })
      ]
    });

    const getBoxes = new lambdanodejs.NodejsFunction(this, 'get-boxes', {
      functionName: fullName('get-boxes'),
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: 'lib/lambdas/get-boxes/index.ts',
      environment: {
        BOXES_TABLE_NAME: boxesTableName
      },
      initialPolicy: [
        new iam.PolicyStatement({
          actions: ['dynamodb:Scan'],
          effect: iam.Effect.ALLOW,
          resources: [`arn:aws:dynamodb:${this.region}:${this.account}:table/${boxesTableName}`]
        })
      ]
    });

    this.lambdas.push(addBox, deleteBox, updateBox, getBox, getBoxes);

    const mensualIncomings = new lambdanodejs.NodejsFunction(this, 'mensual-incomings', {
      functionName: fullName('mensual-incomings'),
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: 'lib/lambdas/mensual-incomings/index.ts',
      timeout: cdk.Duration.seconds(5),
      environment: {
        BOXES_TABLE_NAME: boxesTableName
      },
      initialPolicy: [
        new iam.PolicyStatement({
          actions: ['dynamodb:Scan', 'dynamodb:UpdateItem'],
          effect: iam.Effect.ALLOW,
          resources: [`arn:aws:dynamodb:${this.region}:${this.account}:table/${boxesTableName}`]
        })
      ]
    });

    const rule = new events.Rule(this, 'monthly-rule', {
      schedule: events.Schedule.expression('cron(0 0 1 * ? *)'),
    });

    rule.addTarget(new targets.LambdaFunction(mensualIncomings));
  }
}
