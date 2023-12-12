import * as Joi from 'joi';

interface Input {
  id: string;
  owner: string;
}

export const schema = Joi.object<Input>({
  id: Joi.string().required(),
  owner: Joi.string().required()
}).options({
  abortEarly: false
});
