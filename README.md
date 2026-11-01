# CareerCrew AI

An AI-powered application that generates perfectly formatted, ATS-friendly LaTeX resumes based on user details and job descriptions.

## 🌟 Features

- **AI-Powered Generation**: Uses Gemini/Claude to intelligently tailor resumes against job descriptions.
- **LaTeX Formatting**: Compiles beautiful, perfectly structured ATS-friendly resumes using LaTeX templates.
- **Full-Stack Architecture**: Built with Next.js, Express, and PostgreSQL.
- **Rate Limiting**: Integrated with Upstash Redis to prevent abuse.
- **Secure Authentication**: JWT-based user authentication.

## 💻 Tech Stack

### Frontend
- **Framework**: Next.js (React 19)
- **Styling**: Tailwind CSS v4, Framer Motion
- **UI Components**: Radix UI, Embla Carousel, Lucide React

### Backend
- **Framework**: Express.js (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **AI Integration**: OpenAI SDK (configured for Gemini via API)
- **Rate Limiting**: Upstash Redis

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- Upstash Redis Account
- Google Gemini API Key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in all your actual keys (Database URL, Gemini API Key, Upstash Redis tokens).

4. Set up the Database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   - Create a `.env.local` file and link it to your backend:
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:5000/api
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`.

## 🚢 Deployment

- **Backend**: Can be deployed to Vercel as a Serverless function (see `vercel.json` in the backend folder). **Remember to add your environment variables in the Vercel dashboard!**
- **Frontend**: Can be deployed seamlessly to Vercel or any Next.js compatible hosting provider.

## 📝 License
MIT
