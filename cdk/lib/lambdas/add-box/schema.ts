import * as Joi from 'joi';

interface Input {
  box: {
    owner: string;
    type: 'box' | 'flag';
    title: string;
  }
}

export const schema = Joi.object<Input>({
  box: Joi.object({
    owner: Joi.string().required(),
    type: Joi.string().valid('box', 'flag').required(),
    title: Joi.string().required()
  })
}).options({
  abortEarly: false
});
