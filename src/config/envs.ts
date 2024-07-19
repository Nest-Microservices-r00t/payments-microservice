
import 'dotenv/config';

import * as joi from 'joi';

interface EnvVars {
    PORT: number

    STRIPE_SECRET: string;
    ENDPOINT_SECRET: string;
    STRIPE_SUCCESS_URL: string;
    STRIPE_CANCEL_URL: string;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),

    STRIPE_SECRET: joi.string().required(),
    ENDPOINT_SECRET: joi.string().required(),
    STRIPE_SUCCESS_URL: joi.string().required(),
    STRIPE_CANCEL_URL: joi.string().required(),
}).unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;


export const envs = {
    port: envVars.PORT,

    stripeSecret: envVars.STRIPE_SECRET,
    stripeEndpointSecret: envVars.ENDPOINT_SECRET,
    stripeSuccessUrl: envVars.STRIPE_SUCCESS_URL,
    stripeCancelUrl: envVars.STRIPE_CANCEL_URL,
}