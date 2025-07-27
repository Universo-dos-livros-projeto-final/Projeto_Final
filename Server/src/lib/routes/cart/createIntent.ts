import { FastifyInstance } from 'fastify';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function createIntent(app: FastifyInstance) {
  app.post('/createIntent', async (request, reply) => {
    const { total, nome, email } = request.body as {
      total: number; 
      nome: string;
      email: string;
    };

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: 'eur',
        receipt_email: email,
        description: `Order from ${nome}`,
        metadata: { nome },
      });

      return reply.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      console.error("Error creating PaymentIntent:", error);
      return reply.status(500).send({ error: 'Error creating PaymentIntent' });
    }
  });
}
