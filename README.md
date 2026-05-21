# CleanDispatch

A white-label cleaning services platform connecting clients and professional cleaners in Florida (Apollo Beach, Hillsborough County, Manatee County).

## How It Works

### Client Flow
1. Visit `/client/quote`
2. Enter property details (sqft, bedrooms, bathrooms)
3. Select cleaning type (standard, deep, move-in, move-out)
4. Add optional services (fridge, oven, blinds, laundry)
5. Get instant quote
6. Pick date/time from available slots
7. Pay online via Stripe
8. Job assigned to available cleaner

### Cleaner Flow
1. Sign up at `/cleaner/signup`
2. Complete onboarding: personal info, availability, photos, bank details
3. Background check approval (24-48 hours)
4. View incoming jobs on `/cleaner/dashboard`
5. Accept/decline jobs (2-3 min window)
6. Get automated weekly payouts ($20/hr + $8/job)

### Admin Flow
- `/admin/dashboard` - Overview of revenue, jobs, cleaners, clients
- Monitor performance
- Approve/manage cleaners
- View all transactions

## Pricing

**Quote Formula:**
- Base: $50
- Sqft: ($sqft / 500) × $20
- Bedrooms: $bedrooms × $15
- Bathrooms: $bathrooms × $10
- Service multiplier: standard (1x), deep (1.5x), move-in/out (1.75x)
- Add-ons: fridge ($50), oven ($40), blinds ($30), laundry ($45)

**Cleaner Payout:**
- $20/hour (based on estimated hours)
- $8/job gas fee
- You keep the difference (typically 40-50% margin)

## Tech Stack

- **Frontend:** Next.js 15 + React + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL + Prisma ORM
- **Payments:** Stripe (collect from clients, Stripe Connect payouts to cleaners)
- **Authentication:** TODO (implement after MVP)

## Project Structure

```
app/
├── page.tsx                    # Landing page
├── client/
│   └── quote/page.tsx         # Client booking flow
├── cleaner/
│   ├── signup/page.tsx        # Cleaner onboarding
│   └── dashboard/page.tsx     # Cleaner job management
├── admin/
│   └── dashboard/page.tsx     # Admin overview
└── api/
    ├── jobs/
    │   ├── create/route.ts    # Create job from client quote
    │   ├── assign/route.ts    # Auto-assign to cleaner
    │   └── respond/route.ts   # Cleaner accepts/declines
    ├── payments/
    │   └── create-intent/route.ts  # Stripe payment
    ├── cleaners/
    │   └── signup/route.ts    # Cleaner registration
    └── webhooks/
        └── stripe/route.ts    # Payment webhooks

lib/
└── quoteCalculator.ts         # Quote logic

prisma/
└── schema.prisma              # Database models
```

## Database Models

- **Client** - Customer accounts
- **Cleaner** - Service provider accounts
- **Job** - Cleaning bookings
- **JobAssignment** - Auto-assigned cleaners to jobs
- **Availability** - Cleaner weekly schedule
- **Payment** - Stripe transactions
- **CleanerPayout** - Weekly earnings payouts
- **Review** - Job ratings/feedback
- **BeforeAfterPhoto** - Job photos

## Automation Built-In

- ✅ Instant quote generation
- ✅ Auto-assign jobs to cleaners based on availability
- ✅ Stripe webhook handling (payment confirmation)
- ✅ Weekly automatic payouts
- ✅ Job status tracking
- ✅ Rating/review system

## Next Steps (Phase 2)

1. Connect database (migrate from mocks to Prisma)
2. Authentication (clerk/next-auth)
3. Email notifications (SendGrid/Resend)
4. SMS notifications (Twilio)
5. Stripe Connect for cleaner payouts
6. Background check integration
7. Maps/geolocation for job assignment
8. Before/after photo uploads
9. Job completion workflow
10. Customer support dashboard

## Notes

The app is designed to be hands-off after setup. Clients get instant quotes & book themselves. Cleaners are auto-assigned. Payments are automated via Stripe. You just approve cleaners, then the system runs itself.
