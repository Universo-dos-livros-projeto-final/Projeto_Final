import Fastify from 'fastify';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import cors from '@fastify/cors';

dotenv.config();

console.log('🔑 STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY); // Debug

const fastify = Fastify();

await fastify.register(cors, {
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
  methods: ['GET', 'POST', 'OPTIONS'],
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

fastify.post('/criar-intent', async (req, reply) => {
  const { total, nome, email } = req.body;

  try {
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: 'eur',
      description: `Pagamento de ${nome}`,
      receipt_email: email
    });

    return { clientSecret: intent.client_secret };
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: 'Erro ao criar PaymentIntent' });
  }
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  console.log(`✅ Servidor rodando em: ${address}`);
});
