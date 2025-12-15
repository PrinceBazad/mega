# MegaReality - Real Estate Website

A modern real estate website built with React, Vite, and Flask featuring property listings, filtering, and admin dashboard.

## Features

- Property listings with filtering by location, price, type, and status
- Location-based property filtering (Gurugram and Delhi)
- Property detail pages with image galleries
- Admin dashboard for property management
- Responsive design for all devices
- Smooth animations with Framer Motion

## Tech Stack

- **Frontend**: React 19, Vite, Framer Motion, React Router v7
- **Backend**: Flask (Python)
- **Styling**: CSS3 with modern layout techniques
- **Icons**: React Icons

## Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/PrinceBazad/mega.git
cd mega
```

2. Install frontend dependencies:

```bash
npm install
```

3. Install backend dependencies:

```bash
cd backend
pip install -r requirements.txt
```

## Development

### Running the Frontend

```bash
npm run dev
```

The frontend will be available at http://localhost:5173

### Running the Backend

```bash
cd backend
python app.py
```

The backend API will be available at http://localhost:5000

## Building for Production

### Frontend Build

```bash
npm run build
```

This will create a `dist` folder with the production-ready frontend files.

### Preview Build

```bash
npm run preview
```

Preview the production build locally.

## Deployment to Vercel

### Frontend Deployment

1. Sign up or log in to [Vercel](https://vercel.com/)
2. Click "New Project"
3. Import your Git repository or upload files directly
4. Configure the project:
   - Framework Preset: `Other`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. Add environment variables if needed:
   - `REACT_APP_API_URL`: `https://your-backend-url.com` (when you deploy the backend)
6. Click "Deploy"

### Backend Deployment

For the backend, you'll need to deploy it separately to a platform that supports Python applications such as:

- Render
- Railway
- Heroku
- DigitalOcean App Platform

#### Deploying to Render (Recommended)

1. Sign up or log in to [Render](https://render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: `megareality-backend`
   - Root Directory: `backend`
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`
5. Add environment variables:
   - `SECRET_KEY`: `your-secret-key-here`
6. Click "Create Web Service"

## Environment Variables

### Frontend (Vercel)

- `REACT_APP_API_URL`: The URL of your deployed backend (e.g., https://your-backend.onrender.com)

### Backend (Render/Railway/Heroku)

- `SECRET_KEY`: A secure secret key for Flask
- `FLASK_ENV`: Set to `production`

## API Endpoints

- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get specific property
- `POST /api/admin/login` - Admin login
- `POST /api/admin/properties` - Create property
- `PUT /api/admin/properties/:id` - Update property
- `DELETE /api/admin/properties/:id` - Delete property
- `POST /api/inquiries` - Submit inquiry

## Admin Access

- **Email**: admin@example.com
- **Password**: admin123

## Project Structure

```
mega/
├── backend/
│   ├── app.py          # Flask application
│   ├── requirements.txt # Python dependencies
│   └── ...
├── src/
│   ├── components/     # React components
│   ├── App.jsx         # Main App component
│   └── main.jsx        # Entry point
├── public/             # Static assets
├── dist/               # Production build (generated)
└── ...
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email princebazad@example.com or open an issue in the repository.
