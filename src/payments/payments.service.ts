import { Inject, Injectable, Logger } from '@nestjs/common';
import { envs, NATS_SERVICE } from 'src/config';
import Stripe from 'stripe';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';
import { Request, Response } from 'express';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentsService {

    private readonly stripe = new Stripe(envs.stripeSecret);
    private readonly logger = new Logger('Payments-MS-services');

    constructor(
        @Inject(NATS_SERVICE) private readonly natsClient: ClientProxy
    ) { }

    async createPaymentSession(paymentSessionDto: CreatePaymentSessionDto) {

        const { currency, items, orderId } = paymentSessionDto;

        const lineItems = items.map(item => ({
            price_data: {
                currency,
                product_data: {
                    name: item.name
                },
                unit_amount: Math.round(item.price * 100)
            },
            quantity: item.quantity
        }));


        const session = await this.stripe.checkout.sessions.create({
            payment_intent_data: {
                metadata: {
                    orderId
                }
            },

            line_items: lineItems,
            mode: 'payment',
            success_url: envs.stripeSuccessUrl,
            cancel_url: envs.stripeCancelUrl,
        });



        return {
            cancelUrl: session.cancel_url,
            successUrl: session.success_url,
            url: session.url
        };
    }


    async stripeWehook(req: Request, res: Response) {
        const sig = req.headers['stripe-signature'];

        let event;

        try {
            event = this.stripe.webhooks.constructEvent(
                req['rawBody'],
                sig,
                envs.stripeEndpointSecret
            );
        } catch (err) {
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }


        // Handle the event
        switch (event.type) {
            case 'charge.succeeded':
                const chargeSucceeded = event.data.object;
                const payload = {
                    stripePaymentId: chargeSucceeded.id,
                    orderId: chargeSucceeded.metadata.orderId,
                    receiptUrl: chargeSucceeded.receipt_url,
                }
                this.natsClient.emit('payment.succeeded', payload)
                break;
            // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return res.status(200).json({ sig })
    }
}
