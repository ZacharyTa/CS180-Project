# Recipe App Frontend

A Next.js-based frontend for the recipe application with TypeScript and Supabase integration.

## Prerequisites

- Node.js (v20 or higher)
- npm (comes with Node.js)
- Git

## Getting Started

1. Ensure you've already cloned the repository as mentioned in the [Quick Start](../../README.md#quick-start) section

2. Navigate to the frontend directory:

   ```bash
   cd src/frontend
   ```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the `src/frontend` directory with the following environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=<supabase-url> # We will provide this in the project submission form/comments
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key> # We will provide this in the project submission form/comments
```

5. Start the development server:

```bash
npm run dev
```

- If you aren't redirected to `http://localhost:3000/fyp` immediately, refresh the page

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the app for production
- `npm start`: Start the production server
- `npm run test`: Run tests
- `npm run lint`: Lint the code
- `npm run test:watch` - Run tests in watch mode

## Testing

- We use Jest for testing
- Run tests with the following command:

```bash
npm run test
```

## PWA Support

- The app has PWA support enabled
- You can install the app on your device by clicking on the install button in the address bar!
