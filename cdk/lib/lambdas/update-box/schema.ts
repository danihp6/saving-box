import * as Joi from 'joi';

interface Input {
  box: {
    id: string;
    owner: string;
    type: 'box' | 'flag';
    title: string;
    savings: number;
    incomings: number;
  }
}

export const schema = Joi.object<Input>({
  box: Joi.object({
    id: Joi.string().required(),
    owner: Joi.string().required(),
    type: Joi.string().valid('box', 'flag').required(),
    title: Joi.string().required(),
    savings: Joi.number(),
    incomings: Joi.number().min(0),
    shoppingItems: Joi.array<ShoppingItem>(),
    purchasedItems: Joi.array<PurchasedItem>()
  })
}).options({
  abortEarly: false
});

interface Item {
  name: string;
  amount: number;
}

interface ShoppingItem extends Item {

}

interface PurchasedItem extends Item {

}
