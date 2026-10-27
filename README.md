# Travel Journal

A beautiful, modern travel journal application built with React and Tailwind CSS. Track your adventures, rate destinations, and create a visual diary of your travels around the world.

![Travel Journal Preview](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat&logo=vite)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=flat&logo=github-actions)
![AWS S3](https://img.shields.io/badge/Deploy-AWS_S3-FF9900?style=flat&logo=amazon-s3)

## Features

### Core Functionality
- ** Trip Management** - Add, edit, and delete travel experiences
- ** Interactive Carousel** - Browse through trips with smooth animations
- ** Rating System** - Rate destinations from 1-5 stars
- ** Search & Sort** - Find trips by destination, tags, or description
- ** Statistics Dashboard** - View travel stats including countries visited, continents explored, and ratings

### User Experience
- ** Dark/Light Mode** - Toggle between themes with smooth transitions
- ** Local Storage** - Your data persists across browser sessions
- ** Responsive Design** - Works beautifully on desktop, tablet, and mobile
- ** Custom Scrollbars** - Themed scrollbars that match the UI
- ** Smooth Animations** - Delightful micro-interactions throughout

### Trip Details
- ** Tags** - Categorize trips with custom tags
- ** Highlights** - Record memorable experiences
- ** Considerations** - Note things to keep in mind
- ** Travel Notes** - Add personal tips and recommendations
- ** Budget Tracking** - Log expenses and daily budgets
- ** Image Upload** - Add photos with Base64 encoding

##  Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/travel-journal-react.git

# Navigate to project directory
cd travel-journal-react

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

```
travel-journal-react/
├── public/
│   └── globe.svg           # Favicon
├── src/
│   ├── components/         # React components
│   │   ├── TripCard.jsx        # Main trip display card
│   │   ├── TripFormModal.jsx   # Add/Edit trip form
│   │   ├── DestinationsModal.jsx # All trips view
│   │   ├── TripStats.jsx       # Statistics dashboard
│   │   ├── CustomDropdown.jsx  # Styled dropdown component
│   │   ├── LoadingSpinner.jsx  # Loading animations
│   │   ├── FlashMessage.jsx    # Toast notifications
│   │   ├── ConfirmationModal.jsx # Delete confirmation
│   │   ├── RatingStars.jsx     # Star rating component
│   │   ├── InfoCard.jsx        # Notes/Expenses display
│   │   ├── ThemeToggle.jsx     # Dark mode toggle
│   │   ├── Footer.jsx          # Page footer
│   │   └── index.js            # Component exports
│   ├── data/
│   │   └── tripData.js     # Initial data & configurations
│   ├── hooks/              # Custom React hooks
│   │   ├── useTrips.js         # Trip state management
│   │   ├── useTheme.js         # Theme management
│   │   ├── useFlashMessage.js  # Notification management
│   │   ├── useModal.js         # Modal state management
│   │   └── index.js            # Hook exports
│   ├── utils/              # Utility functions
│   │   ├── colorUtils.js       # Color manipulation helpers
│   │   └── index.js            # Utility exports
│   ├── styles/
│   │   └── TravelJournal.css # Custom CSS & animations
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # React entry point
│   └── index.css           # Global styles & Tailwind
├── .gitignore
├── .env.example            # Environment variables template
├── package.json
├── tailwind.config.js      # Tailwind configuration
├── vite.config.js          # Vite configuration
├── postcss.config.js       # PostCSS configuration
├── eslint.config.js        # ESLint configuration
├── CONTRIBUTING.md         # Contribution guidelines
└── README.md               # This file
```

##  Tech Stack

| Technology | Purpose |
|------------|---------|
| [React 18](https://react.dev/) | UI Framework |
| [Vite](https://vitejs.dev/) | Build Tool & Dev Server |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [Lucide React](https://lucide.dev/) | Icons |
| [ESLint](https://eslint.org/) | Code Linting |

##  Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run test suite |
| `npm run test:coverage` | Run tests with coverage report |

## CI/CD Pipeline

This project uses **GitHub Actions** to automate testing, building, and deployment to **AWS S3**.

### Pipeline Overview

| Trigger | Action |
|---------|--------|
| Push to `develop` | Run tests → Build → Deploy to **Staging** |
| Push to `main` | Run tests → Build → Deploy to **Production** |
| Pull Request | Run tests & lint only (no deployment) |
| Manual Dispatch | Deploy to selected environment |

### Pipeline Features

- **Automated Testing** - Runs test suite on every push/PR
- **Code Quality** - ESLint checks for code standards
- **Build Verification** - Ensures production build succeeds
- **S3 Deployment** - Automatic sync to AWS S3 buckets
- **CloudFront Invalidation** - Optional CDN cache invalidation
- **Environment Protection** - Separate staging/production environments

### Setup Requirements

To enable CI/CD, configure the following in your GitHub repository:

**Secrets** (Settings → Secrets and variables → Actions):
- `AWS_ACCESS_KEY_ID` - AWS IAM access key
- `AWS_SECRET_ACCESS_KEY` - AWS IAM secret key

**Variables** (Settings → Secrets and variables → Actions):
- `AWS_REGION` - AWS region (e.g., `us-east-1`)
- `S3_BUCKET_STAGING` - Staging S3 bucket name
- `S3_BUCKET_PRODUCTION` - Production S3 bucket name

For detailed setup instructions, see [.github/DEPLOYMENT.md](.github/DEPLOYMENT.md).

## Customization

### Adding New Continents/Countries

Edit `src/data/tripData.js`:

```javascript
export const continentCountryMap = {
  "Your Continent": [
    { name: "Country Name", flag: "🏳️" },
    // Add more countries...
  ],
  // ...
};
```

### Modifying Theme Colors

The app uses a sky-to-indigo gradient theme. Customize in:
- `tailwind.config.js` - Add custom colors
- `src/styles/TravelJournal.css` - Modify CSS variables

### Adding New Trip Fields

1. Update the trip object structure in `src/data/tripData.js`
2. Modify `TripFormModal.jsx` to include new form fields
3. Update `TripCard.jsx` to display new fields

##  Browser Support

| Browser | Support |
|---------|---------|
| Chrome | Latest |
| Firefox |  Latest |
| Safari |  Latest |
| Edge |  Latest |

##  Responsive Breakpoints

| Breakpoint | Screen Size |
|------------|-------------|
| `sm` | 640px+ |
| `md` | 768px+ |
| `lg` | 1024px+ |
| `xl` | 1280px+ |

## Data Privacy

- All data is stored locally in your browser's localStorage
- No data is sent to external servers
- Images are stored as Base64 encoded strings
- Clear browser data to reset the application

##  Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a PR.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

##  Acknowledgments

- [Lucide Icons](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Unsplash](https://unsplash.com/) for placeholder images
- [Postimages](https://postimages.org/) for image hosting

##  Support

If you have any questions or need help, please:
- Open an [issue](https://github.com/yourusername/travel-journal-react/issues)
- Check existing issues for solutions

---

<p align="center">
  Made with for travelers everywhere
</p>

---

## Copyright

Copyright (c) 2026 Green Rider Technology LLP (Ethara AI). All rights reserved.
