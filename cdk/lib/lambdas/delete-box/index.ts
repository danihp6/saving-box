import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { schema } from './schema';

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

  const { id, owner } = value;

  await dynamodb.send(new DeleteItemCommand({
    TableName: BOXES_TABLE_NAME,
    Key: marshall({
      id,
      owner
    })
  }));

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      id
    })
  };
}
