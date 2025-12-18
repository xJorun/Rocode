import { Router, raw } from 'express'
import Stripe from 'stripe'
import { db, users } from '../db'
import { eq } from 'drizzle-orm'

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-11-20.acacia' })
  : null

const router = Router()

router.get('/plans', (req, res) => {
  res.json({
    plans: [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        features: [
          'Full account & profile',
          'Public leaderboards',
          '20 submissions per day',
          'Editorials after solve',
        ],
      },
      {
        id: 'pro-monthly',
        name: 'Pro Monthly',
        price: 9.99,
        interval: 'month',
        priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
        features: [
          'Unlimited submissions',
          'Full editorial access',
          'Analytics dashboard',
          'Interview prep mode',
          'Pro badge',
        ],
      },
      {
        id: 'pro-yearly',
        name: 'Pro Yearly',
        price: 99.99,
        interval: 'year',
        priceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
        features: [
          'Everything in Pro Monthly',
          '2 months free',
        ],
      },
    ],
  })
})

router.post('/checkout', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ error: 'Payments not configured' })
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { priceId } = req.body

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID required' })
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, req.user.id))
      .limit(1)

    let customerId = user?.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: {
          userId: req.user.id,
          robloxUserId: req.user.robloxUserId,
        },
      })
      customerId = customer.id

      await db
        .update(users)
        .set({ stripeCustomerId: customerId })
        .where(eq(users.id, req.user.id))
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
      metadata: {
        userId: req.user.id,
      },
    })

    res.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    res.status(500).json({ error: 'Failed to create checkout session' })
  }
})

router.post('/webhook', raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) {
    return res.status(503).send('Payments not configured')
  }

  const sig = req.headers['stripe-signature'] as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return res.status(400).send('Webhook Error')
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (userId && session.subscription) {
          await db
            .update(users)
            .set({
              planTier: 'pro',
              stripeSubscriptionId: session.subscription as string,
              updatedAt: new Date(),
            })
            .where(eq(users.id, userId))
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.stripeCustomerId, customerId))
          .limit(1)

        if (user) {
          const isActive = subscription.status === 'active' || subscription.status === 'trialing'
          await db
            .update(users)
            .set({
              planTier: isActive ? 'pro' : 'free',
              updatedAt: new Date(),
            })
            .where(eq(users.id, user.id))
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        await db
          .update(users)
          .set({
            planTier: 'free',
            stripeSubscriptionId: null,
            updatedAt: new Date(),
          })
          .where(eq(users.stripeCustomerId, customerId))
        break
      }
    }
  } catch (error) {
    console.error('Webhook processing error:', error)
    return res.status(500).send('Webhook processing failed')
  }

  res.json({ received: true })
})

router.get('/status', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const [user] = await db
      .select({
        planTier: users.planTier,
        stripeSubscriptionId: users.stripeSubscriptionId,
      })
      .from(users)
      .where(eq(users.id, req.user.id))
      .limit(1)

    let subscription = null
    if (user?.stripeSubscriptionId && stripe) {
      try {
        subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId)
      } catch (e) {
        console.error('Failed to fetch subscription:', e)
      }
    }

    res.json({
      planTier: user?.planTier || 'free',
      subscription: subscription
        ? {
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          }
        : null,
    })
  } catch (error) {
    console.error('Get billing status error:', error)
    res.status(500).json({ error: 'Failed to fetch billing status' })
  }
})

router.post('/portal', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({ error: 'Payments not configured' })
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const [user] = await db
      .select({ stripeCustomerId: users.stripeCustomerId })
      .from(users)
      .where(eq(users.id, req.user.id))
      .limit(1)

    if (!user?.stripeCustomerId) {
      return res.status(400).json({ error: 'No billing account found' })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    })

    res.json({ url: session.url })
  } catch (error) {
    console.error('Portal error:', error)
    res.status(500).json({ error: 'Failed to create portal session' })
  }
})

export { router as billingRouter }

