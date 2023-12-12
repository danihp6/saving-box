import { Handler } from 'aws-lambda';
import { DynamoDBClient, ScanCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const BOXES_TABLE_NAME = process.env.BOXES_TABLE_NAME;

const dynamodb = new DynamoDBClient();

export const handler: Handler = async () => {

  const response = await dynamodb.send(new ScanCommand({
    TableName: BOXES_TABLE_NAME
  }));

  if (response.Items) {
    await Promise.all(response.Items.map(async item => {
      const box = unmarshall(item);

      if (box.incomings) {
        await dynamodb.send(new UpdateItemCommand({
          TableName: BOXES_TABLE_NAME,
          Key: marshall({
            id: box.id,
            owner: box.owner
          }),
          UpdateExpression:'SET savings = :savings',
          ExpressionAttributeValues: marshall({
            ':savings': box.savings ?? 0 + box.incomings
          }),
        }));
      }
    }));
  }
}
