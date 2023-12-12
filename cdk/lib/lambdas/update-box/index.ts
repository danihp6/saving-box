import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
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

  const { box } = value;

  const itemKeys = Object.keys(box).filter(key => key !== 'id' && key !== 'owner');

  await dynamodb.send(new UpdateItemCommand({
    TableName: BOXES_TABLE_NAME,
    Key: marshall({
      id: box.id,
      owner: box.owner
    }),
    UpdateExpression: `SET ${itemKeys.map((k, index) => `#field${index} = :value${index}`).join(', ')}`,
    ExpressionAttributeNames: itemKeys.reduce((accumulator, k, index) => ({ ...accumulator, [`#field${index}`]: k }), {}),
    ExpressionAttributeValues: marshall(itemKeys.reduce((accumulator, k, index) => ({ ...accumulator, [`:value${index}`]: (box as any)[k] }), {})),
  }));

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      box
    })
  };
}
