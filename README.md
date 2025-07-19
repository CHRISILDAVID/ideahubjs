# IdeaHub - Next.js + React + Supabase

A modern idea sharing platform built with Next.js, React, and Supabase.

## Features

- 🚀 Next.js 14 with App Directory
- ⚛️ React 18
- 🎨 Tailwind CSS for styling
- 🔐 Supabase Authentication
- 🗄️ Supabase Database
- 🌙 Dark mode support
- 📱 Responsive design
- 🔍 Search functionality
- ⭐ Star and fork ideas
- 👥 User profiles
- 📊 Analytics dashboard

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd IDEA_HUB_JS
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Supabase Setup

1. Create a new Supabase project
2. Set up the database schema (refer to the original TypeScript version for schema)
3. Enable Authentication
4. Copy your project URL and anon key to the environment variables

## Project Structure

```
IDEA_HUB_JS/
├── components/
│   ├── Auth/
│   ├── Ideas/
│   └── Layout/
├── contexts/
├── lib/
├── pages/
├── services/
├── types/
└── styles/
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Add environment variables in the Vercel dashboard
3. Deploy

### Other Platforms

This is a standard Next.js application and can be deployed on any platform that supports Node.js.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
