---
title: "AWS Finally Tells You Which Policy Hates You"
date: 2026-01-21
description: "AWS now includes policy ARNs in AccessDenied errors. Only took them a decade."
tags:
  - AWS
  - IAM
  - Security
  - DevOps
---

Look, I don't want to be dramatic, but debugging `AccessDenied` errors in AWS has shaved years off my life. You get this beautifully unhelpful message telling you *a service control policy* blocked your request and then AWS just... wishes you luck. Which SCP? Oh, that's your problem. Have fun clicking through every OU in your org hierarchy like it's 2014.

Well, as of today, AWS finally decided to stop being cryptic about it.

## What Actually Changed

AccessDenied error messages now include the full ARN of the policy that blocked your request. SCPs, RCPs, identity-based policies, session policies, permission boundaries, all of them. Same-account and same-org scenarios.

That's it. That's the update. And honestly? It might be the most useful thing AWS has shipped in months.

## Let Me Paint You a Picture

Here's how this used to go. Your deploy pipeline fails at 4:47 PM on a Friday. The error says something like:

```
User: arn:aws-us-gov:iam::123456789012:user/bob is not authorized
to perform: s3:PutObject with an explicit deny in a service control policy
```

Cool. *A* service control policy. You have 23 of them spread across 6 OUs. Time to start clicking.

You open the Organizations console. You trace the OU path. You open each SCP, cmd+F for `s3:PutObject`, find nothing because the deny is on `s3:*`, and repeat until your eyes glaze over. Somewhere around SCP number 14 you start questioning your career choices. Eventually you find it, fix it, and lose an hour you'll never get back.

Now? AWS just hands you the policy ARN right in the error. You click it. You see the deny. You fix it. You quit work on time for once.

## Where This Actually Matters

If you're running a single account with a couple of IAM roles, this probably doesn't change your life much. But if you're dealing with any of these, you know the pain:

Vast multi-account orgs with SCPs stacked on SCPs. Permission boundaries scoping down roles that are already scoped down. Compliance environments where every action has three layers of "no" before it gets to "maybe." CI/CD roles that mysteriously stop working because someone tightened a policy in a parent OU and didn't tell anyone.

That last one. That one happens *constantly*.

## The Fine Print

AWS says this is rolling out gradually across services and regions, so don't rage at them if you don't see policy ARNs in every error tomorrow. I know I personally saw this missing on an `s3:PutObject` in us-gov-east-1....But it's coming. Patience. I know, I know, we've been patient for years already.

## Final Thoughts

This isn't a flashy re:Invent announcement. There's no new service name to memorize. But this is the kind of change that actually respects the time of the people using the platform every day. Every engineer who's burned half a morning on an SCP scavenger hunt just got that time back.

Now if they could just make IAM policy syntax less of a JSON nightmare, that'd be great.

Docs: [IAM Troubleshooting](https://docs.aws.amazon.com/IAM/latest/UserGuide/troubleshoot_access-denied.html) | [Announcement](https://aws.amazon.com/about-aws/whats-new/2026/01/additional-policy-details-access-denied-error/)
