# Real Estate Backend API

This is the backend API for the Real Estate website built with Flask.

## Features

- Admin authentication with JWT
- Property management (CRUD)
- Inquiry handling
- Property search and filtering

## Setup

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Set environment variables in `.env` file

3. Run the application:

```bash
python app.py
```

## API Endpoints

### Public Routes

- `GET /api/health` - Health check
- `GET /api/properties` - Get all properties (with filtering)
- `GET /api/properties/<id>` - Get specific property
- `POST /api/inquiries` - Submit inquiry

### Admin Routes

- `POST /api/admin/login` - Admin login
- `POST /api/admin/properties` - Create property
- `PUT /api/admin/properties/<id>` - Update property
- `DELETE /api/admin/properties/<id>` - Delete property
- `GET /api/admin/inquiries` - Get all inquiries

## Database Schema

### Admins

- id (Integer, Primary Key)
- name (String)
- email (String, Unique)
- password_hash (String)
- role (String)
- created_at (DateTime)

### Properties

- id (Integer, Primary Key)
- title (String)
- description (Text)
- price (Float)
- location (String)
- property_type (String) - House, Flat, Plot
- status (String) - Available, Sold, Rent
- bedrooms (Integer)
- bathrooms (Integer)
- area_sqft (Integer)
- images (Text) - Comma-separated image paths
- created_at (DateTime)

### Inquiries

- id (Integer, Primary Key)
- user_name (String)
- email (String)
- phone (String)
- property_id (Integer, Foreign Key)
- message (Text)
- created_at (DateTime)
