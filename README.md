# Scrappy - Web Scraping Workflow Automation Platform

A powerful, visual web scraping automation platform that allows users to create complex scraping workflows using a drag-and-drop interface. Built with Next.js, React Flow, and AI-powered data extraction capabilities.

## ✨ Features

### 🎯 Visual Workflow Builder

- **Drag & Drop Interface**: Create scraping workflows visually using React Flow
- **Node-based Architecture**: Multiple task types for different scraping operations
- **Real-time Validation**: Connection validation and cycle prevention
- **Live Preview**: Test workflows before deployment

### 🤖 AI-Powered Extraction

- **Smart Data Extraction**: Uses AI to extract structured data from unstructured content
- **Natural Language Prompts**: Describe what you want to extract in plain English
- **Multiple AI Providers**: Support for various AI models via credentials system

### 🔧 Comprehensive Task Library

- **Browser Automation**: Launch browsers, navigate, click, fill forms
- **Data Extraction**: Extract text, HTML, and AI-powered structured data
- **Timing Controls**: Wait for elements, scroll controls
- **Data Processing**: JSON manipulation, property reading/writing
- **Result Delivery**: Webhook integration for data delivery

### 💳 Credit-Based Billing

- **Transparent Pricing**: Each task has a clear credit cost
- **Flexible Packages**: Small, Medium, and Large credit packages
- **Usage Analytics**: Track credit consumption over time
- **Stripe Integration**: Secure payment processing

### 🔒 Security & Credentials

- **Encrypted Storage**: All credentials encrypted with AES-256-CBC
- **Secure API Keys**: Safely store and manage API keys for AI services
- **User Isolation**: Complete data separation between users

### 📊 Analytics & Monitoring

- **Execution History**: Track all workflow runs
- **Performance Metrics**: Monitor success rates and execution times
- **Credit Usage**: Detailed consumption analytics
- **Error Logging**: Comprehensive error tracking

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account (for billing)
- Clerk account (for authentication)

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/scrappy"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Encryption
ENCRYPTION_KEY=your-32-byte-hex-encryption-key

# Billing (Stripe)
STRIPE_API_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SMALL_PACK_PRICE_ID=price_...
STRIPE_MEDIUM_PACK_PRICE_ID=price_...
STRIPE_LARGE_PACK_PRICE_ID=price_...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd scraper
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up the database**

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push
```

4. **Start the development server**

```bash
npm run dev
```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Workflow Engine**: React Flow for visual workflow creation
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Payments**: Stripe
- **AI Integration**: Support for multiple AI providers
- **Deployment**: Vercel-ready

### Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Main application pages
│   └── workflow/          # Workflow editor
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── providers/        # React providers
├── lib/                  # Utility functions and configurations
│   ├── workflow/         # Workflow execution engine
│   └── encryption.ts     # Security utilities
├── types/                # TypeScript type definitions
└── actions/              # Server actions
```

## 🎮 Usage Guide

### Creating Your First Workflow

1. **Navigate to Workflows**: Go to `/workflows` in the application
2. **Create New Workflow**: Click "Create Workflow" button
3. **Design Your Workflow**:
   - Drag tasks from the sidebar onto the canvas
   - Connect tasks by dragging from output handles to input handles
   - Configure each task with required parameters
4. **Test Your Workflow**: Use the "Execute" button to test
5. **Publish**: Once satisfied, publish your workflow for production use

### Available Task Types

#### Browser Automation

- **Launch Browser**: Initialize a browser instance
- **Navigate to URL**: Navigate to a specific webpage
- **Click Element**: Click on page elements using CSS selectors
- **Fill Input**: Fill form inputs with data
- **Scroll to Element**: Scroll page elements into view

#### Data Extraction

- **Page to HTML**: Extract raw HTML from current page
- **Extract Text from Element**: Get text content from specific elements
- **Extract Data with AI**: Use AI to extract structured data

#### Data Processing

- **Read Property from JSON**: Extract values from JSON objects
- **Add Property to JSON**: Add new properties to JSON objects

#### Timing & Control

- **Wait for Element**: Wait for elements to appear on page

#### Result Delivery

- **Deliver via Webhook**: Send extracted data to external endpoints

### Managing Credits

1. **Check Balance**: View your current credit balance on the dashboard
2. **Purchase Credits**: Buy credit packages through the billing page
3. **Monitor Usage**: Track consumption through analytics
4. **Cost Planning**: Each task shows its credit cost in the task menu

### Setting Up Credentials

1. **Go to Credentials**: Navigate to `/credentials`
2. **Add New Credential**: Click "Create Credential"
3. **Enter Details**: Provide name and API key/secret
4. **Use in Workflows**: Reference credentials in AI extraction tasks

## 🔧 Configuration

### Task Credits

Each task type has an associated credit cost:

- Browser operations: 1-2 credits
- Data extraction: 2-5 credits
- AI-powered extraction: 10 credits

### Credit Packages

- **Small Package**: 1,000 credits - $20.00
- **Medium Package**: 5,500 credits - $110.00
- **Large Package**: 12,000 credits - $240.00

## 🚀 Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Database Setup

1. Set up PostgreSQL database (recommend using services like Supabase or Railway)
2. Update `DATABASE_URL` in environment variables
3. Run migrations: `npx prisma db push`

### Stripe Configuration

1. Create products and prices in Stripe dashboard
2. Set up webhook endpoints for payment processing
3. Update price IDs in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React Flow](https://reactflow.dev/) for the visual workflow editor
- [Clerk](https://clerk.dev/) for authentication
- [Stripe](https://stripe.com/) for payment processing
- [Prisma](https://prisma.io/) for database management
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Support

For support, questions, or feature requests:

- Create an issue in this repository
- Contact the development team

---

Built with ❤️ using Next.js and modern web technologies.
