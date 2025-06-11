# 🚴 Bike Shop Link Manager

A web-based link management system for bike shops to organize vendor/brand links, B2B portals, manuals, warranty info, and more.

## Features

- **Hierarchical Organization**: Brands as main categories with multiple links each
- **Flexible Categories**: Fully customizable link categories
- **Search & Filter**: Real-time search across brands, links, and descriptions
- **Click Tracking**: Analytics to see which links are used most
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean interface with animations and gradients

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Run the setup script:
   ```bash
   bash setup.sh
   ```

2. Navigate to the project:
   ```bash
   cd bike-shop-links
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Managing Brands
- Click "Add Brand" to create a new brand
- Click the trash icon on a brand card to delete it (and all its links)

### Managing Links
- Click "Add Link" to add a new link
- Click the plus icon on a brand card to add a link to that specific brand
- Click the edit icon on a link to modify it
- Click the trash icon on a link to delete it

### Managing Categories
- Click "Categories" in the header to manage link categories
- Add, edit, or delete categories as needed
- All categories are fully customizable

### Searching
- Use the search bar to filter brands and links
- Search works across brand names, link titles, descriptions, and categories

## Database

The app uses SQLite for development. The database file (`bike-shop.db`) is created automatically on first run.

### Switching to PostgreSQL for Production

1. Install PostgreSQL adapter:
   ```bash
   npm install @vercel/postgres
   ```

2. Update `lib/db.ts` to use PostgreSQL connection
3. Set `DATABASE_URL` in your environment variables

## Deployment

### Vercel Deployment

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables if using PostgreSQL
4. Deploy

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **SQLite** (development) / PostgreSQL (production)
- **Tailwind CSS** for styling
- **Lucide React** for icons

## Fixed Issues

- ✅ No more duplicate sample data on page refresh
- ✅ Fixed TypeScript type errors
- ✅ Consistent interface definitions
- ✅ Proper property mapping between components

## Future Enhancements

- User authentication
- Import/export CSV functionality
- Bulk operations
- Link validation
- Custom fields per brand
- Dark mode support

## License

MIT
