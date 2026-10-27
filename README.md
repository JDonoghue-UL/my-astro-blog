# my-astro-blog

A server-rendered Astro blog deployed as a Docker container to AWS ECS Fargate behind an Application Load Balancer.

## Prerequisites

- Node.js `>=22.12.0` (from `package.json`)
- npm
- Docker Desktop (required for local container builds and CDK container asset publishing)

For AWS deployment, also install and configure:

- AWS CLI credentials with access to deploy CDK stacks
- AWS CDK CLI (`npm install -g aws-cdk` or `npx cdk`)

## Project Structure

```text
.
├── cdk/                 # AWS CDK app for ECS Fargate + Application Load Balancer
├── public/              # Static assets served as-is
├── src/
│   ├── assets/          # Images, fonts, and other bundled assets
│   ├── components/      # Reusable Astro components
│   ├── content/
│   │   ├── authors/     # Author profile entries used by blog posts
│   │   └── blog/        # Blog post content (.md/.mdx)
│   ├── layouts/         # Page and post layouts
│   ├── pages/           # Route files and page entry points
│   └── content.config.ts# Content collection schema for blog/authors
├── tests/               # Playwright end-to-end tests
├── Dockerfile           # Production container build
└── astro.config.mjs     # Astro configuration (Node adapter, integrations)
```

## Setup

From the repository root:

```sh
npm install
```

## Local Development

### Repository convention (required): run Astro in background mode

Start the dev server:

```sh
astro dev --background
```

Manage the background server:

```sh
astro dev status
astro dev logs
astro dev stop
```

### npm command reference

All commands are run from the repository root:

| Command | Action |
| :------ | :----- |
| `npm install` | Install dependencies |
| `npm run dev` | Start Astro dev server (foreground) |
| `npm run build` | Build production output |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run astro -- --help` | Show Astro CLI help |

## Content Authoring

Blog content is defined with Astro content collections (`src/content.config.ts`).

- Add posts in `src/content/blog/` as `.md` or `.mdx`
- Add/update author entries in `src/content/authors/` as `.md` or `.mdx`
- Blog posts require frontmatter fields:
  - `title` (string)
  - `description` (string)
  - `pubDate` (date-like value)
- Optional blog fields:
  - `updatedDate`
  - `heroImage`
  - `author` (defaults to `site-author`)

For schema and collection behavior, see Astro Content Collections docs:
- https://docs.astro.build/en/guides/content-collections/

## Build and Deploy

### Build and run with Docker (local)

```sh
docker build -t my-astro-blog .
docker run --rm -p 4321:8080 my-astro-blog
```

Then open `http://localhost:4321`.

### Deploy to AWS ECS Fargate with CDK

This repository includes a CDK app in `cdk/` that builds the root Docker image, deploys an ECS Fargate service, and publishes it through an Application Load Balancer.

From `cdk/`:

```sh
npm install
npx cdk bootstrap   # first-time setup per account/region
npx cdk deploy
```

Useful CDK commands:

```sh
npx cdk diff
npx cdk synth
```

## Astro Documentation

- Main docs: https://docs.astro.build
- Routing: https://docs.astro.build/en/guides/routing/
- Astro components: https://docs.astro.build/en/basics/astro-components/
- Framework components: https://docs.astro.build/en/guides/framework-components/
- Styling: https://docs.astro.build/en/guides/styling/
- Internationalization: https://docs.astro.build/en/guides/internationalization/
