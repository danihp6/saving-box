#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as stacks from '../lib/stacks';
import { fullName } from '../lib/utils';

const app = new cdk.App({context: {}});

new stacks.DatabaseStack(app, 'DatabaseStack', {
  stackName: fullName('DatabaseStack')
});

const computeStack = new stacks.ComputeStack(app, 'ComputeStack', {
  stackName: fullName('ComputeStack')
});

new stacks.IntegrationStack(app, 'IntegrationStack', {
  stackName: fullName('IntegrationStack'),
  lambdas: computeStack.lambdas
});
