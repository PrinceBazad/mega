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

## Deployment Options

### Option 1: Deploy Frontend to Netlify/Vercel

1. Build the frontend:

```bash
npm run build
```

2. Upload the `dist` folder to your hosting provider.

### Option 2: Deploy Backend to Render/Railway

1. Create a `Procfile` in the backend directory:

```
web: gunicorn app:app
```

2. Update the Flask app to use the PORT environment variable:

```python
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
```

### Option 3: Full Deployment to Railway

Railway allows you to deploy both frontend and backend in one project.

1. Create a `railway.toml` file in the root directory:

```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm run build && npx serve dist"
```

2. For the backend, Railway will automatically detect the Python requirements.

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
SECRET_KEY=your_secret_key_here
FLASK_ENV=production
```

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
