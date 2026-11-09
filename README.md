# House painter website - Next.js Full-Stack Application

A production website built for a working painting business, with a content-driven public site, a local-SEO page architecture, and a full admin dashboard. Built with Next.js 16 and covered by unit and end-to-end tests.

## Live

Page: 

## Overview

A content-driven web application built with Next.js 16, serving a real painting business. The public site is optimized for local SEO (service and service-area pages), while a role-protected admin dashboard lets the owner manage all content and view traffic analytics — no code or redeploy needed to update the site.

## Key features

- Public, SEO-focused site - dedicated service pages (interior painting, wallpapering, varnishing, refresh painting) and service-area pages, structured for local search
- Admin dashboard -  manage services, prices, images, blog posts and service areas, with built-in traffic analytics
- Authentication & authorization - JWT-based login protecting the dashboard
- Contact & email - transactional email delivery via Resend
- Blog - content managed from the dashboard.


## Tech Stack

Frontend:
- Next.js - PPR/cache components and routing
- TypeScript - type-safe frontend and backend logic
- Recharts - admin analytics visualization


Backend:
- Node.js (Next.js REST API routes)
- Jsonwebtoken - authentication and authorization
- Zod - request validation


Data & services:
- MongoDB, Mongoose - content storage
- Resend - transactional email delivery


Rendering strategies used:
- PPR for all pages


## Testing:
- Unit tests (Vitest) - covering all helpers functions, server actions and Mongoose models
- End-to-end tests (Playwright) - covering key user flows.

## Rendering strategy
Partial Prerendering (PPR) across all pages - a static shell served instantly, with dynamic parts streamed in.


## Getting Started
The using guide (`setup.md`) is available in the `/docs` folder.

## Documentation

Detailed technical documentation is available in the `/docs` folder.