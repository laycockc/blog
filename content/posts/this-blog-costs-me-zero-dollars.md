---
title: "This Blog Costs Me $0"
date: 2026-02-26
description: "How I run a full dev blog on Hugo, Cloudflare Pages, and GitHub without spending a dime. The only thing it costs me is time I was going to waste anyway."
tags:
  - Hugo
  - Cloudflare
  - GitHub
  - DevOps
---

I've wanted to start a blog to note my adventures for a while now, but I live in AWS all day, and assumed it would at least cost me something to host it. But the true cost is nothing. Zero dollars. Not "basically free." Not "free tier that'll surprise you with a bill in 90 days." Actually, genuinely, $0 a month. (domain registration fees aside)

And it's not some janky setup held together with cron jobs and prayers. It's fast, simple, and it deploys itself when I push to main. Let me walk you through the whole thing.

## The Stack

Here it is, the entire operation:

**Hugo** for the static site generator. **Coder** for the theme. **GitHub** for the repo. **Cloudflare Pages** for hosting and deploys. **Cloudflare DNS** for the custom domain.

That's it. No servers. No containers. No database. No monthly invoice from AWS reminding you that a NAT Gateway you forgot about has been quietly billing you $35 a month for six months. Not that I'd know anything about that.

## Hugo

I went with [Hugo](https://gohugo.io) because I wanted to write blog posts, not maintain a CMS. You write a markdown file, drop it in a folder, and Hugo turns it into a static site. It's dumb fast. We're talking full site builds in - done. 

The [Coder](https://github.com/luizdepra/hugo-coder) theme does the heavy lifting on the design side. It's clean, it's minimal, it doesn't try to be clever. I don't need parallax scrolling and animated gradients. I need somewhere to put words about AWS making me frustrated. Coder handles that perfectly.

## GitHub

The whole thing lives in a public repo on GitHub. Nothing exotic here. I write a post in markdown, commit it, push it, and that's essentially the end of my involvement.


## Cloudflare Pages

This is where the magic happens. [Cloudflare Pages](https://pages.cloudflare.com) connects to the GitHub repo, watches for pushes to main, runs `hugo` to build the site, and deploys it to their edge network. Globally. For ✨***free***✨.

The free tier gives you 500 builds a month. I may write a few posts a month. I am not going to hit that limit. The site gets served from whatever Cloudflare edge node is closest to whoever is reading it, so it loads fast basically everywhere.

No nginx config. No Docker compose files. No "oh right, the SSL cert expired." Cloudflare handles HTTPS automatically. The whole deploy pipeline is just... push to main.

## Cloudflare DNS

I pointed my domain's nameservers to Cloudflare and set up the DNS records to point at the Pages deployment. Cloudflare gives you DNS management for free, and it's genuinely good. Fast propagation, clean UI, and it plays nicely with Pages since it's all under the same roof.

The only thing I actually pay for in this entire setup is the domain registration itself, and that's like $10 a year through namecheap.

## The Workflow

Here's what writing a new blog post actually looks like:

1. Create a new markdown file in `content/posts/`
2. Write the post
3. `git add`, `git commit`, `git push`
4. Cloudflare Pages picks it up, builds it, deploys it

No Terraform plans (yeah, it made me sad too). No Docker builds. No CI/CD YAML files that are longer than the blog post itself. Just markdown and a git push. It's the most relaxed part of my day, and I work with AWS for a living so the bar is admittedly low.

## Final Thoughts

If you've been putting off starting a blog because you think you need to set up a VPS, configure a database, or pick between seventeen JavaScript frameworks, you don't. Hugo, a free theme, GitHub, and Cloudflare Pages. You can have the whole thing running in an afternoon.

It costs nothing, it scales to whatever traffic you'll realistically get, and you own every piece of it. The hardest part is actually sitting down and writing, and I can't automate that for you.

Well, I *could*. But just use an LLM. 
