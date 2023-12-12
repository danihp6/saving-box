import * as Joi from 'joi';

interface Input {
  owner: string;
}

export const schema = Joi.object<Input>({
  owner: Joi.string().required()
}).options({
  abortEarly: false
});
