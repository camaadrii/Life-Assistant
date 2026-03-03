# Life Assistant

A personal life management app where you can capture thoughts, organize by category, set due dates, add tags, and use AI to clarify your ideas.

## Features

- 📝 **Quick Capture** - Instantly dump thoughts into Home, Work, School, or Personal categories
- 🏷️ **Tagging** - Add multiple tags to organize notes
- 📅 **Due Dates** - Set deadlines and get visual alerts for overdue items
- 🔍 **Search** - Find notes by text or tags
- ✨ **AI Assistant** - Use Claude to clarify and refine your thoughts
- 💾 **Auto-Save** - All notes save to your browser automatically
- 📱 **Responsive** - Works on phone, tablet, and desktop

## How to Deploy to Vercel

### Step 1: Push to GitHub

On your phone or computer:

1. Go to [github.com](https://github.com) and sign in
2. Click **+** → **New repository**
3. Name it `life-assistant`
4. Click **Create repository**

If you have git on your computer:
```bash
cd path/to/this/folder
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/life-assistant.git
git push -u origin main
```

### Step 2: Deploy with Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Click **Import Git Repository**
4. Paste your GitHub repo URL
5. Click **Import**
6. Click **Deploy**

That's it! Vercel will give you a live URL like `life-assistant.vercel.app`

You can now access it from any device by visiting that URL!

## Using the App

- **Add Notes**: Select a category, write text, optionally add due date and tags
- **Search**: Type to search by text or tags
- **Jump Categories**: Click category buttons to switch contexts instantly
- **Last Note**: See where you left off in each category
- **AI Help**: Click "Clarify a Thought" to get Claude to help organize ideas
- **Overdue Alerts**: Items with past due dates show in red

## Syncing Across Devices

Notes save to your browser's local storage. Each device/browser keeps its own copy. To sync across devices:

- Use the same browser (Chrome, Safari, etc.) if you're signed in
- Or manually export/import notes later (feature coming soon)

Enjoy organizing your life!
