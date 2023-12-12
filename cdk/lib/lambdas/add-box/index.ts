import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { schema } from './schema';
import * as uuid from 'uuid';

const BOXES_TABLE_NAME = process.env.BOXES_TABLE_NAME;

const dynamodb = new DynamoDBClient();

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log(event);

  let input;
  if (event.httpMethod) {
    const pathParameters = event.pathParameters || {};
    let body = event.body ? JSON.parse(event.body) : {};

    input = {
      ...pathParameters,
      ...body,
    };
    console.log(input);
  } else {
    input = event;
  }

  const { value, error } = schema.validate(input);
  if (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'schema error',
        details: error.details
      })
    };
  }
  const box = {
    id: uuid.v4(),
    ...value.box
  };

  await dynamodb.send(new PutItemCommand({
    TableName: BOXES_TABLE_NAME,
    Item: marshall(box)
  }));

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      box
    })
  };
}
