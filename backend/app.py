from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sqlite3
from datetime import datetime
import hashlib
import uuid
import json

app = Flask(__name__)

# Configure CORS properly to avoid duplicate headers
CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Handle OPTIONS requests explicitly
@app.before_request
def handle_options():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'OK'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response, 200

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'fallback_secret_key_for_dev')

# Database initialization
DATABASE = 'megareality.db'

def init_db():
    """Initialize the database with tables and sample data if they don't exist"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Create tables if they don't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'admin',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS properties (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            location TEXT NOT NULL,
            property_type TEXT NOT NULL,
            status TEXT DEFAULT 'Available',
            bedrooms INTEGER DEFAULT 0,
            bathrooms INTEGER DEFAULT 0,
            area_sqft INTEGER DEFAULT 0,
            builder_id INTEGER,
            is_favorite BOOLEAN DEFAULT 0,
            images TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS agents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            position TEXT,
            experience TEXT,
            properties_sold INTEGER DEFAULT 0,
            image TEXT,
            bio TEXT,
            is_favorite BOOLEAN DEFAULT 0
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            location TEXT NOT NULL,
            status TEXT DEFAULT 'Available',
            completion_date TEXT,
            total_units INTEGER DEFAULT 0,
            builder_id INTEGER,
            images TEXT,
            tag TEXT DEFAULT 'available',
            is_favorite BOOLEAN DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            type TEXT,
            area TEXT,
            price_range TEXT,
            address TEXT,
            city TEXT,
            state TEXT,
            pincode TEXT
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS builders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            projects_count INTEGER DEFAULT 0,
            image TEXT,
            description TEXT
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS home_content (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            section TEXT NOT NULL,
            content TEXT NOT NULL
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS inquiries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            property_id INTEGER,
            message TEXT,
            status TEXT DEFAULT 'pending',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            message TEXT NOT NULL,
            admin_id INTEGER,
            admin_name TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            read_status BOOLEAN DEFAULT 0
        )
    ''')
    
    # Check if sample admin exists
    cursor.execute("SELECT COUNT(*) FROM admins")
    if cursor.fetchone()[0] == 0:
        # Insert sample admin
        admin_password_hash = hashlib.sha256('admin123'.encode()).hexdigest()
        cursor.execute('''
            INSERT INTO admins (name, email, password_hash, role, created_at)
            VALUES (?, ?, ?, ?, ?)
        ''', ('Admin User', 'admin@example.com', admin_password_hash, 'admin', datetime.now().isoformat()))
    
    # Check if sample properties exist
    cursor.execute("SELECT COUNT(*) FROM properties")
    if cursor.fetchone()[0] == 0:
        # Insert sample properties
        sample_properties = [
            {
                'title': 'Luxury Villa in Sector 15',
                'description': 'Beautiful modern villa with stunning garden views in the heart of Gurugram',
                'price': 2500000,
                'location': 'Sector 15, Gurugram, Haryana',
                'property_type': 'House',
                'status': 'Available',
                'bedrooms': 5,
                'bathrooms': 4,
                'area_sqft': 4500,
                'builder_id': 1,
                'images': json.dumps(['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80']),
                'created_at': datetime.now().isoformat()
            },
            {
                'title': 'Modern Apartment in MG Road',
                'description': 'Contemporary apartment in prime location of Gurugram',
                'price': 850000,
                'location': 'MG Road, Gurugram, Haryana',
                'property_type': 'Flat',
                'status': 'Available',
                'bedrooms': 2,
                'bathrooms': 2,
                'area_sqft': 1200,
                'builder_id': 2,
                'images': json.dumps(['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80']),
                'created_at': datetime.now().isoformat()
            },
            {
                'title': 'Premium Condo in DLF Phase 1',
                'description': 'Luxury condo with premium amenities in DLF Phase 1',
                'price': 1200000,
                'location': 'DLF Phase 1, Gurugram, Haryana',
                'property_type': 'Flat',
                'status': 'Available',
                'bedrooms': 3,
                'bathrooms': 3,
                'area_sqft': 2100,
                'builder_id': 1,
                'images': json.dumps(['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80']),
                'created_at': datetime.now().isoformat()
            },
            {
                'title': 'Spacious House in South Delhi',
                'description': 'Elegant house with beautiful garden in South Delhi',
                'price': 3200000,
                'location': 'South Delhi, New Delhi',
                'property_type': 'House',
                'status': 'Available',
                'bedrooms': 4,
                'bathrooms': 3,
                'area_sqft': 3500,
                'builder_id': 3,
                'images': json.dumps(['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80']),
                'created_at': datetime.now().isoformat()
            },
            {
                'title': 'Luxury Penthouse in Central Delhi',
                'description': 'Stunning penthouse with panoramic city views',
                'price': 4500000,
                'location': 'Central Delhi, New Delhi',
                'property_type': 'Flat',
                'status': 'Available',
                'bedrooms': 4,
                'bathrooms': 4,
                'area_sqft': 3800,
                'builder_id': 5,
                'images': json.dumps(['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80']),
                'created_at': datetime.now().isoformat()
            },
            {
                'title': 'Affordable Apartment in East Delhi',
                'description': 'Well-designed apartment in a developing locality of East Delhi',
                'price': 650000,
                'location': 'East Delhi, New Delhi',
                'property_type': 'Flat',
                'status': 'Available',
                'bedrooms': 2,
                'bathrooms': 2,
                'area_sqft': 1100,
                'builder_id': 6,
                'images': json.dumps(['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80']),
                'created_at': datetime.now().isoformat()
            }
        ]
        
        for prop in sample_properties:
            cursor.execute('''
                INSERT INTO properties (title, description, price, location, property_type, 
                status, bedrooms, bathrooms, area_sqft, builder_id, images, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                prop['title'], prop['description'], prop['price'], prop['location'],
                prop['property_type'], prop['status'], prop['bedrooms'], prop['bathrooms'],
                prop['area_sqft'], prop['builder_id'], prop['images'], prop['created_at']
            ))
    
    # Check if sample agents exist
    cursor.execute("SELECT COUNT(*) FROM agents")
    if cursor.fetchone()[0] == 0:
        # Insert sample agents
        sample_agents = [
            {
                'name': 'John Smith',
                'email': 'john.smith@megareality.com',
                'phone': '+91 98765 43210',
                'position': 'Senior Real Estate Agent',
                'experience': '8 years',
                'properties_sold': 120,
                'image': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
                'bio': 'Specialized in luxury properties and commercial real estate with extensive knowledge of local market trends.',
                'is_favorite': 0
            },
            {
                'name': 'Sarah Johnson',
                'email': 'sarah.johnson@megareality.com',
                'phone': '+91 98765 43211',
                'position': 'Residential Property Expert',
                'experience': '6 years',
                'properties_sold': 95,
                'image': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
                'bio': 'Focuses on residential properties with expertise in first-time home buyers and family housing.',
                'is_favorite': 0
            },
            {
                'name': 'Michael Brown',
                'email': 'michael.brown@megareality.com',
                'phone': '+91 98765 43212',
                'position': 'Commercial Real Estate Specialist',
                'experience': '10 years',
                'properties_sold': 150,
                'image': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
                'bio': 'Expert in commercial properties, office spaces, and retail locations with strong negotiation skills.',
                'is_favorite': 0
            },
            {
                'name': 'Emily Davis',
                'email': 'emily.davis@megareality.com',
                'phone': '+91 98765 43213',
                'position': 'Property Investment Advisor',
                'experience': '7 years',
                'properties_sold': 110,
                'image': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
                'bio': 'Helps clients with property investment strategies and portfolio management for maximum ROI.',
                'is_favorite': 0
            }
        ]
        
        for agent in sample_agents:
            cursor.execute('''
                INSERT INTO agents (name, email, phone, position, experience, properties_sold, 
                image, bio, is_favorite)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                agent['name'], agent['email'], agent['phone'], agent['position'],
                agent['experience'], agent['properties_sold'], agent['image'],
                agent['bio'], agent['is_favorite']
            ))
    
    # Check if sample projects exist
    cursor.execute("SELECT COUNT(*) FROM projects")
    if cursor.fetchone()[0] == 0:
        # Insert sample projects
        sample_projects = [
            {
                'title': 'Skyline Heights',
                'description': 'Luxury residential towers with panoramic city views',
                'location': 'Sector 23, Gurugram, Haryana',
                'status': 'Available',
                'completion_date': '2025-12-31',
                'total_units': 120,
                'builder_id': 1,
                'images': json.dumps(['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80']),
                'tag': 'latest',
                'is_favorite': 0,
                'created_at': datetime.now().isoformat(),
                'type': 'Residential',
                'area': '50 acres',
                'price_range': '₹80L - ₹2Cr',
                'address': 'Sector 23, Golf Course Road',
                'city': 'Gurugram',
                'state': 'Haryana',
                'pincode': '122002'
            },
            {
                'title': 'Green Valley Apartments',
                'description': 'Eco-friendly residential complex with green spaces',
                'location': 'Sector 45, Gurugram, Haryana',
                'status': 'Working',
                'completion_date': '2026-06-30',
                'total_units': 80,
                'builder_id': 2,
                'images': json.dumps(['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80']),
                'tag': 'working',
                'is_favorite': 0,
                'created_at': datetime.now().isoformat(),
                'type': 'Apartment',
                'area': '35 acres',
                'price_range': '₹60L - ₹1.5Cr',
                'address': 'Sector 45, Udyog Vihar',
                'city': 'Gurugram',
                'state': 'Haryana',
                'pincode': '122016'
            },
            {
                'title': 'Royal Enclave',
                'description': 'Premium gated community with luxury amenities',
                'location': 'South Delhi, New Delhi',
                'status': 'Available',
                'completion_date': '2024-05-15',
                'total_units': 200,
                'builder_id': 3,
                'images': json.dumps(['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80']),
                'tag': 'available',
                'is_favorite': 0,
                'created_at': datetime.now().isoformat(),
                'type': 'Villa',
                'area': '100 acres',
                'price_range': '₹1.5Cr - ₹5Cr',
                'address': 'Lodhi Road',
                'city': 'New Delhi',
                'state': 'Delhi',
                'pincode': '110003'
            }
        ]
        
        for project in sample_projects:
            cursor.execute('''
                INSERT INTO projects (title, description, location, status, completion_date,
                total_units, builder_id, images, tag, is_favorite, created_at, type, area,
                price_range, address, city, state, pincode)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                project['title'], project['description'], project['location'], project['status'],
                project['completion_date'], project['total_units'], project['builder_id'],
                project['images'], project['tag'], project['is_favorite'], project['created_at'],
                project['type'], project['area'], project['price_range'], project['address'],
                project['city'], project['state'], project['pincode']
            ))
    
    # Check if sample builders exist
    cursor.execute("SELECT COUNT(*) FROM builders")
    if cursor.fetchone()[0] == 0:
        # Insert sample builders
        sample_builders = [
            {
                'name': 'DLF Limited',
                'projects_count': 125,
                'image': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=400&fit=crop',
                'description': 'Leading real estate developer with projects across India'
            },
            {
                'name': 'Amrapali Group',
                'projects_count': 89,
                'image': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=400&fit=crop',
                'description': 'Premium residential and commercial property developer'
            },
            {
                'name': 'Godrej Properties',
                'projects_count': 156,
                'image': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=400&fit=crop',
                'description': 'Innovative sustainable living solutions provider'
            },
            {
                'name': 'Prestige Estates',
                'projects_count': 98,
                'image': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=400&fit=crop',
                'description': 'Luxury residential and commercial developments'
            },
            {
                'name': 'Oberoi Realty',
                'projects_count': 72,
                'image': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop',
                'description': 'High-end luxury property developers'
            },
            {
                'name': 'Tata Housing',
                'projects_count': 112,
                'image': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=400&fit=crop',
                'description': 'Quality affordable and premium housing solutions'
            }
        ]
        
        for builder in sample_builders:
            cursor.execute('''
                INSERT INTO builders (name, projects_count, image, description)
                VALUES (?, ?, ?, ?)
            ''', (builder['name'], builder['projects_count'], builder['image'], builder['description']))
    
    # Check if home content exists
    cursor.execute("SELECT COUNT(*) FROM home_content")
    if cursor.fetchone()[0] == 0:
        # Insert default home content
        home_content = {
            'hero': {
                'title': 'Find Your Dream Property',
                'subtitle': 'Discover the perfect place to call home with MegaReality',
                'backgroundImage': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
            },
            'about': {
                'title': 'About MegaReality',
                'description': 'We are a leading real estate company dedicated to helping you find your perfect property. With years of experience and a commitment to excellence, we make your property dreams come true.',
                'image': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
            },
            'contact': {
                'phone': '+91 98765 43210',
                'email': 'info@megareality.com',
                'address': '123 Real Estate Avenue, Gurugram, Haryana 122001',
            },
            'properties': {
                'title': 'Featured Properties',
                'description': 'Discover our handpicked selection of premium properties',
            },
            'agents': {
                'title': 'Our Expert Agents',
                'description': 'Meet our team of experienced real estate professionals',
            },
            'services': {
                'title': 'Our Services',
                'description': 'Comprehensive real estate solutions tailored to your needs',
            },
            'autoscroll': {
                'title': 'Auto-Scroll Section',
                'description': 'Dynamic content that auto-scrolls to showcase our offerings',
                'pages': [
                    {
                        'backgroundImage': 'https://images.unsplash.com/photo-1560448204-e02f33c33ddc?w=1920&q=80',
                        'title': 'Premium Properties',
                        'description': 'Discover our collection of premium properties in the best locations',
                    },
                    {
                        'backgroundImage': 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1920&q=80',
                        'title': 'Luxury Living',
                        'description': 'Experience luxury living with our exclusive property collection',
                    },
                    {
                        'backgroundImage': 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1920&q=80',
                        'title': 'Modern Designs',
                        'description': 'Modern architectural designs for contemporary living',
                    },
                    {
                        'backgroundImage': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80',
                        'title': 'Affordable Options',
                        'description': 'Find affordable options without compromising on quality',
                    },
                    {
                        'backgroundImage': 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80',
                        'title': 'Investment Opportunities',
                        'description': 'Great investment opportunities with high returns',
                    },
                ],
            },
            'typewriter': {
                'messages': ['Find Your Dream Property', 'Discover the perfect place to call home'],
            },
        }
        
        for section, content in home_content.items():
            cursor.execute('''
                INSERT INTO home_content (section, content)
                VALUES (?, ?)
            ''', (section, json.dumps(content)))
    
    conn.commit()
    conn.close()

def get_db_connection():
    """Get a database connection"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # This enables column access by name
    return conn

# Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'OK', 'message': 'Real Estate API is running'})

# Admin Authentication
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM admins WHERE email = ?", (email,))
    admin = cursor.fetchone()
    
    conn.close()
    
    if admin and admin['password_hash'] == hashlib.sha256(password.encode()).hexdigest():
        return jsonify({
            'access_token': 'sample_jwt_token',
            'admin': {
                'id': admin['id'],
                'name': admin['name'],
                'email': admin['email'],
                'role': admin['role']
            }
        }), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401

# Admin Management Routes
@app.route('/api/admin/register', methods=['POST'])
def register_admin():
    data = request.get_json()
    
    # Validate required fields
    if not data.get('name') or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Name, email, and password are required'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if admin with this email already exists
    cursor.execute("SELECT * FROM admins WHERE email = ?", (data['email'],))
    if cursor.fetchone():
        conn.close()
        return jsonify({'message': 'Admin with this email already exists'}), 409
    
    # Create new admin
    password_hash = hashlib.sha256(data['password'].encode()).hexdigest()
    cursor.execute('''
        INSERT INTO admins (name, email, password_hash, role, created_at)
        VALUES (?, ?, ?, ?, ?)
    ''', (data['name'], data['email'], password_hash, data.get('role', 'admin'), datetime.now().isoformat()))
    
    admin_id = cursor.lastrowid
    
    # Add notification for admin creation
    cursor.execute('''
        INSERT INTO notifications (type, message, admin_id, admin_name, created_at, read_status)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', ('admin', f'New admin added: {data["name"]}', admin_id, data['name'], datetime.now().isoformat(), 0))
    
    conn.commit()
    
    # Get the newly created admin
    cursor.execute("SELECT id, name, email, role, created_at FROM admins WHERE id = ?", (admin_id,))
    new_admin = cursor.fetchone()
    conn.close()
    
    return jsonify(dict(new_admin)), 201

@app.route('/api/admins', methods=['GET'])
def get_admins():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, name, email, role, created_at FROM admins")
    admins = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    
    return jsonify(admins)

@app.route('/api/admins/<int:admin_id>', methods=['PUT'])
def update_admin(admin_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Find admin by ID
    cursor.execute("SELECT * FROM admins WHERE id = ?", (admin_id,))
    admin = cursor.fetchone()
    if not admin:
        conn.close()
        return jsonify({'message': 'Admin not found'}), 404
    
    data = request.get_json()
    
    # Prepare update fields
    update_fields = []
    params = []
    
    if 'name' in data:
        update_fields.append("name = ?")
        params.append(data['name'])
    if 'email' in data:
        # Check if email already exists for another admin
        cursor.execute("SELECT * FROM admins WHERE email = ? AND id != ?", (data['email'], admin_id))
        if cursor.fetchone():
            conn.close()
            return jsonify({'message': 'Email already exists'}), 409
        update_fields.append("email = ?")
        params.append(data['email'])
    if 'role' in data:
        update_fields.append("role = ?")
        params.append(data['role'])
    if 'password' in data and data['password']:
        password_hash = hashlib.sha256(data['password'].encode()).hexdigest()
        update_fields.append("password_hash = ?")
        params.append(password_hash)
    
    if update_fields:
        update_query = f"UPDATE admins SET {', '.join(update_fields)} WHERE id = ?"
        params.append(admin_id)
        cursor.execute(update_query, params)
        
        # Add notification for admin update
        cursor.execute('''
            INSERT INTO notifications (type, message, admin_id, admin_name, created_at, read_status)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', ('admin', f'Admin updated: {data.get("name", admin["name"])}', admin_id, data.get('name', admin['name']), datetime.now().isoformat(), 0))
    
    conn.commit()
    
    # Get updated admin
    cursor.execute("SELECT id, name, email, role, created_at FROM admins WHERE id = ?", (admin_id,))
    updated_admin = cursor.fetchone()
    conn.close()
    
    return jsonify(dict(updated_admin))

@app.route('/api/admins/<int:admin_id>', methods=['DELETE'])
def delete_admin(admin_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if there's only one admin
    cursor.execute("SELECT COUNT(*) FROM admins")
    if cursor.fetchone()[0] <= 1:
        conn.close()
        return jsonify({'message': 'Cannot delete the last admin'}), 400
    
    # Find admin by ID
    cursor.execute("SELECT * FROM admins WHERE id = ?", (admin_id,))
    admin = cursor.fetchone()
    if not admin:
        conn.close()
        return jsonify({'message': 'Admin not found'}), 404
    
    # Remove admin
    cursor.execute("DELETE FROM admins WHERE id = ?", (admin_id,))
    
    # Add notification for admin deletion
    cursor.execute('''
        INSERT INTO notifications (type, message, admin_id, admin_name, created_at, read_status)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', ('admin', f'Admin deleted: {admin["name"]}', admin_id, admin['name'], datetime.now().isoformat(), 0))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Admin deleted successfully'})

# Property Routes
@app.route('/api/properties', methods=['GET'])
def get_properties():
    # Get query parameters for filtering
    property_type = request.args.get('type')
    location = request.args.get('location')
    status = request.args.get('status')
    min_price = request.args.get('min_price')
    max_price = request.args.get('max_price')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = "SELECT * FROM properties"
    params = []
    
    conditions = []
    if property_type:
        conditions.append("property_type = ?")
        params.append(property_type)
    
    if location:
        conditions.append("location LIKE ?")
        params.append(f'%{location}%')
    
    if status:
        conditions.append("status = ?")
        params.append(status)
    
    if min_price:
        conditions.append("price >= ?")
        params.append(float(min_price))
    
    if max_price:
        conditions.append("price <= ?")
        params.append(float(max_price))
    
    if conditions:
        query += " WHERE " + " AND ".join(conditions)
    
    cursor.execute(query, params)
    properties = cursor.fetchall()
    
    # Get builder names for each property
    result = []
    for prop in properties:
        prop_dict = dict(prop)
        # Convert images from JSON string to list
        try:
            prop_dict['images'] = json.loads(prop_dict['images']) if prop_dict['images'] else []
        except:
            prop_dict['images'] = []
        
        # Get builder name if builder_id exists
        if prop_dict['builder_id']:
            cursor.execute("SELECT name FROM builders WHERE id = ?", (prop_dict['builder_id'],))
            builder = cursor.fetchone()
            if builder:
                prop_dict['builder_name'] = builder['name']
            else:
                prop_dict['builder_name'] = ""
        else:
            prop_dict['builder_name'] = ""
        
        result.append(prop_dict)
    
    conn.close()
    return jsonify(result)

@app.route('/api/properties/<int:property_id>', methods=['GET'])
def get_property(property_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM properties WHERE id = ?", (property_id,))
    property = cursor.fetchone()
    
    if property:
        prop_dict = dict(property)
        # Convert images from JSON string to list
        try:
            prop_dict['images'] = json.loads(prop_dict['images']) if prop_dict['images'] else []
        except:
            prop_dict['images'] = []
        
        # Get builder name if builder_id exists
        if prop_dict['builder_id']:
            cursor.execute("SELECT name FROM builders WHERE id = ?", (prop_dict['builder_id'],))
            builder = cursor.fetchone()
            if builder:
                prop_dict['builder_name'] = builder['name']
            else:
                prop_dict['builder_name'] = ""
        else:
            prop_dict['builder_name'] = ""
        
        conn.close()
        return jsonify(prop_dict)
    
    conn.close()
    return jsonify({'message': 'Property not found'}), 404

# Protected Admin Routes
@app.route('/api/admin/properties', methods=['GET'])
def get_admin_properties():
    # In a real app, this would require authentication
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM properties")
    properties = cursor.fetchall()
    
    # Get builder names for each property
    result = []
    for prop in properties:
        prop_dict = dict(prop)
        # Convert images from JSON string to list
        try:
            prop_dict['images'] = json.loads(prop_dict['images']) if prop_dict['images'] else []
        except:
            prop_dict['images'] = []
        
        # Get builder name if builder_id exists
        if prop_dict['builder_id']:
            cursor.execute("SELECT name FROM builders WHERE id = ?", (prop_dict['builder_id'],))
            builder = cursor.fetchone()
            if builder:
                prop_dict['builder_name'] = builder['name']
            else:
                prop_dict['builder_name'] = ""
        else:
            prop_dict['builder_name'] = ""
        
        result.append(prop_dict)
    
    conn.close()
    return jsonify(result)

@app.route('/api/admin/properties', methods=['POST'])
def create_property():
    # In a real app, this would require authentication
    data = request.get_json()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get builder info if builder_id is provided
    builder_id = data.get('builder_id')
    builder_name = ""
    if builder_id:
        cursor.execute("SELECT name FROM builders WHERE id = ?", (builder_id,))
        builder = cursor.fetchone()
        if builder:
            builder_name = builder['name']
    
    # Convert images list to JSON string
    images_json = json.dumps(data.get('images', []))
    
    cursor.execute('''
        INSERT INTO properties (title, description, price, location, property_type, 
        status, bedrooms, bathrooms, area_sqft, builder_id, images, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['title'], data.get('description', ''), float(data['price']), data['location'],
        data['property_type'], data.get('status', 'Available'), 
        data.get('bedrooms', 0), data.get('bathrooms', 0), 
        data.get('area_sqft', 0), builder_id, images_json, datetime.now().isoformat()
    ))
    
    property_id = cursor.lastrowid
    
    # Add notification for property creation
    cursor.execute('''
        INSERT INTO notifications (type, message, admin_id, admin_name, created_at, read_status)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', ('property', f'New property added: {data["title"]}', 1, 'Admin User', datetime.now().isoformat(), 0))
    
    conn.commit()
    
    # Get the newly created property
    cursor.execute("SELECT * FROM properties WHERE id = ?", (property_id,))
    new_property = cursor.fetchone()
    conn.close()
    
    prop_dict = dict(new_property)
    # Convert images from JSON string to list
    try:
        prop_dict['images'] = json.loads(prop_dict['images']) if prop_dict['images'] else []
    except:
        prop_dict['images'] = []
    
    prop_dict['builder_name'] = builder_name
    
    return jsonify(prop_dict), 201

@app.route('/api/admin/properties/<int:property_id>', methods=['PUT'])
def update_property(property_id):
    # In a real app, this would require authentication
    data = request.get_json()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get current property to get original title
    cursor.execute("SELECT * FROM properties WHERE id = ?", (property_id,))
    current_property = cursor.fetchone()
    if not current_property:
        conn.close()
        return jsonify({'message': 'Property not found'}), 404
    
    original_title = current_property['title']
    
    # Get builder info if builder_id is provided
    builder_id = data.get('builder_id')
    builder_name = current_property['builder_name'] if current_property['builder_name'] else ""
    if builder_id and builder_id != current_property['builder_id']:
        cursor.execute("SELECT name FROM builders WHERE id = ?", (builder_id,))
        builder = cursor.fetchone()
        if builder:
            builder_name = builder['name']
    
    # Prepare update fields
    update_fields = []
    params = []
    
    if 'title' in data:
        update_fields.append("title = ?")
        params.append(data['title'])
    if 'description' in data:
        update_fields.append("description = ?")
        params.append(data['description'])
    if 'price' in data:
        update_fields.append("price = ?")
        params.append(float(data['price']))
    if 'location' in data:
        update_fields.append("location = ?")
        params.append(data['location'])
    if 'property_type' in data:
        update_fields.append("property_type = ?")
        params.append(data['property_type'])
    if 'status' in data:
        update_fields.append("status = ?")
        params.append(data['status'])
    if 'bedrooms' in data:
        update_fields.append("bedrooms = ?")
        params.append(data['bedrooms'])
    if 'bathrooms' in data:
        update_fields.append("bathrooms = ?")
        params.append(data['bathrooms'])
    if 'area_sqft' in data:
        update_fields.append("area_sqft = ?")
        params.append(data['area_sqft'])
    if 'builder_id' in data:
        update_fields.append("builder_id = ?")
        params.append(data['builder_id'])
    if 'images' in data:
        # Convert images list to JSON string
        images_json = json.dumps(data['images'])
        update_fields.append("images = ?")
        params.append(images_json)
    if 'is_favorite' in data:
        update_fields.append("is_favorite = ?")
        params.append(data['is_favorite'])
    
    if update_fields:
        update_query = f"UPDATE properties SET {', '.join(update_fields)} WHERE id = ?"
        params.append(property_id)
        cursor.execute(update_query, params)
        
        # Add notification for property update
        cursor.execute('''
            INSERT INTO notifications (type, message, admin_id, admin_name, created_at, read_status)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', ('property', f'Property updated: {data.get("title", original_title)}', 1, 'Admin User', datetime.now().isoformat(), 0))
    
    conn.commit()
    
    # Get updated property
    cursor.execute("SELECT * FROM properties WHERE id = ?", (property_id,))
    updated_property = cursor.fetchone()
    
    conn.close()
    
    if not updated_property:
        return jsonify({'message': 'Property not found after update'}), 404
    
    # Get builder name for updated property
    updated_builder_name = ""
    if updated_property['builder_id']:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM builders WHERE id = ?", (updated_property['builder_id'],))
        builder = cursor.fetchone()
        if builder:
            updated_builder_name = builder['name']
        conn.close()
    
    prop_dict = dict(updated_property)
    # Convert images from JSON string to list
    try:
        prop_dict['images'] = json.loads(prop_dict['images']) if prop_dict['images'] else []
    except:
        prop_dict['images'] = []
    
    prop_dict['builder_name'] = updated_builder_name
    
    return jsonify(prop_dict)

@app.route('/api/admin/properties/<int:property_id>', methods=['DELETE'])
def delete_property(property_id):
    # In a real app, this would require authentication
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM properties WHERE id = ?", (property_id,))
    property = cursor.fetchone()
    if not property:
        conn.close()
        return jsonify({'message': 'Property not found'}), 404
    
    # Remove property
    cursor.execute("DELETE FROM properties WHERE id = ?", (property_id,))
    
    # Add notification for property deletion
    cursor.execute('''
        INSERT INTO notifications (type, message, admin_id, admin_name, created_at, read_status)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', ('property', f'Property deleted: {property["title"]}', 1, 'Admin User', datetime.now().isoformat(), 0))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Property deleted successfully'})

@app.route('/api/admin/properties/<int:property_id>/favorite', methods=['PUT'])
def toggle_property_favorite(property_id):
    # In a real app, this would require authentication
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM properties WHERE id = ?", (property_id,))
    property = cursor.fetchone()
    if not property:
        conn.close()
        return jsonify({'message': 'Property not found'}), 404
    
    data = request.get_json()
    new_favorite_status = data.get('is_favorite', False)
    
    cursor.execute("UPDATE properties SET is_favorite = ? WHERE id = ?", (int(new_favorite_status), property_id))
    
    # Get updated property
    cursor.execute("SELECT * FROM properties WHERE id = ?", (property_id,))
    updated_property = cursor.fetchone()
    
    # Add notification for favorite status change
    status_text = 'added to' if new_favorite_status else 'removed from'
    cursor.execute('''
        INSERT INTO notifications (type, message, admin_id, admin_name, created_at, read_status)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', ('property', f'Property {status_text} favorites: {updated_property["title"]}', 1, 'Admin User', datetime.now().isoformat(), 0))
    
    # Get builder name for updated property
    updated_builder_name = ""
    if updated_property['builder_id']:
        cursor.execute("SELECT name FROM builders WHERE id = ?", (updated_property['builder_id'],))
        builder = cursor.fetchone()
        if builder:
            updated_builder_name = builder['name']
    
    conn.commit()
    conn.close()
    
    prop_dict = dict(updated_property)
    # Convert images from JSON string to list
    try:
        prop_dict['images'] = json.loads(prop_dict['images']) if prop_dict['images'] else []
    except:
        prop_dict['images'] = []
    
    prop_dict['builder_name'] = updated_builder_name
    
    return jsonify(prop_dict)

# Agent Routes
@app.route('/api/agents', methods=['GET'])
def get_agents():
    # Get query parameters for filtering
    search_name = request.args.get('name')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = "SELECT * FROM agents"
    params = []
    
    if search_name:
        query += " WHERE name LIKE ?"
        params.append(f'%{search_name}%')
    
    cursor.execute(query, params)
    agents = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    return jsonify(agents)

@app.route('/api/agents/<int:agent_id>', methods=['GET'])
def get_agent(agent_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM agents WHERE id = ?", (agent_id,))
    agent = cursor.fetchone()
    
    if agent:
        conn.close()
        return jsonify(dict(agent))
    
    conn.close()
    return jsonify({'message': 'Agent not found'}), 404

# Admin Agent Management Routes
@app.route('/api/admin/agents', methods=['GET'])
def get_admin_agents():
    # In a real app, this would require authentication
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM agents")
    agents = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    return jsonify(agents)

@app.route('/api/admin/agents', methods=['POST'])
def create_agent():
    # In a real app, this would require authentication
    data = request.get_json()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO agents (name, email, phone, position, experience, properties_sold, image, bio, is_favorite)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['name'], data.get('email', ''), data.get('phone', ''), 
        data.get('position', ''), data.get('experience', ''), 
        data.get('properties_sold', 0), data.get('image', ''), 
        data.get('bio', ''), data.get('is_favorite', False)
    ))
    
    agent_id = cursor.lastrowid
    
    # Add notification for agent creation
    cursor.execute('''
        INSERT INTO notifications (type, message, admin_id, admin_name, created_at, read_status)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', ('agent', f'New agent added: {data["name"]}', 1, 'Admin User', datetime.now().isoformat(), 0))
    
    conn.commit()
    
    # Get the newly created agent
    cursor.execute("SELECT * FROM agents WHERE id = ?", (agent_id,))
    new_agent = cursor.fetchone()
    conn.close()
    
    return jsonify(dict(new_agent)), 201

@app.route('/api/admin/agents/<int:agent_id>', methods=['PUT'])
def update_agent(agent_id):
    # In a real app, this would require authentication
    data = request.get_json()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get current agent to get original name
    cursor.execute("SELECT * FROM agents WHERE id = ?", (agent_id,))
    current_agent = cursor.fetchone()
    if not current_agent:
        conn.close()
        return jsonify({'message': 'Agent not found'}), 404
    
    original_name = current_agent['name']
    
    # Prepare update fields
    update_fields = []
    params = []
    
    if 'name' in data:
        update_fields.append("name = ?")
        params.append(data['name'])
    if 'email' in data:
        update_fields.append("email = ?")
        params.append(data['email'])
    if 'phone' in data:
        update_fields.append("phone = ?")
        params.append(data['phone'])
    if 'position' in data:
        update_fields.append("position = ?")
        params.append(data['position'])
    if 'experience' in data:
        update_fields.append("experience = ?")
        params.append(data['experience'])
    if 'properties_sold' in data:
        update_fields.append("properties_sold = ?")
        params.append(data['properties_sold'])
    if 'image' in data:
        update_fields.append("image = ?")
        params.append(data['image'])
    if 'bio' in data:
        update_fields.append("bio = ?")
        params.append(data['bio'])
    if 'is_favorite' in data:
        update_fields.append("is_favorite = ?")
        params.append(data['is_favorite'])
    
    if update_fields:
        update_query = f"UPDATE agents SET {', '.join(update_fields)} WHERE id = ?"
        params.append(agent_id)
        cursor.execute(update_query, params)
        
        # Add notification for agent update
        cursor.execute('''
            INSERT INTO notifications (type, message, admin_id, admin_name, created_at, read_status)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', ('agent', f'Agent updated: {data.get("name", original_name)}', 1, 'Admin User', datetime.now().isoformat(), 0))
    
    conn.commit()
    
    # Get updated agent
    cursor.execute("SELECT * FROM agents WHERE id = ?", (agent_id,))
    updated_agent = cursor.fetchone()
    conn.close()
    
    return jsonify(dict(updated_agent))

@app.route('/api/admin/agents/<int:agent_id>', methods=['DELETE'])
def delete_agent(agent_id):
    # In a real app, this would require authentication
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM agents WHERE id = ?", (agent_id,))
    agent = cursor.fetchone()
    if not agent:
        conn.close()
        return jsonify({'message': 'Agent not found'}), 404
    
    # Remove agent
    cursor.execute("DELETE FROM agents WHERE id = ?", (agent_id,))
    
    # Add notification for agent deletion
    cursor.execute('''
        INSERT INTO notifications (type, message, admin_id, admin_name, created_at, read_status)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', ('agent', f'Agent deleted: {agent["name"]}', 1, 'Admin User', datetime.now().isoformat(), 0))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Agent deleted successfully'})

@app.route('/api/admin/agents/<int:agent_id>/favorite', methods=['PUT'])
def toggle_agent_favorite(agent_id):
    # In a real app, this would require authentication
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM agents WHERE id = ?", (agent_id,))
    agent = cursor.fetchone()
    if not agent:
        conn.close()
        return jsonify({'message': 'Agent not found'}), 404
    
    data = request.get_json()
    new_favorite_status = data.get('is_favorite', False)
    
    cursor.execute("UPDATE agents SET is_favorite = ? WHERE id = ?", (int(new_favorite_status), agent_id))
    
    # Get updated agent
    cursor.execute("SELECT * FROM agents WHERE id = ?", (agent_id,))
    updated_agent = cursor.fetchone()
    
    # Add notification for favorite status change
    status_text = 'added to' if new_favorite_status else 'removed from'
    cursor.execute('''
        INSERT INTO notifications (type, message, admin_id, admin_name, created_at, read_status)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', ('agent', f'Agent {status_text} favorites: {updated_agent["name"]}', 1, 'Admin User', datetime.now().isoformat(), 0))
    
    conn.commit()
    conn.close()
    
    return jsonify(dict(updated_agent))

# Builder Routes
@app.route('/api/builders', methods=['GET'])
def get_builders():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM builders")
    builders = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    return jsonify(builders)

@app.route('/api/builders/<int:builder_id>', methods=['GET'])
def get_builder(builder_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM builders WHERE id = ?", (builder_id,))
    builder = cursor.fetchone()
    
    if builder:
        conn.close()
        return jsonify(dict(builder))
    
    conn.close()
    return jsonify({'message': 'Builder not found'}), 404

# Admin Builder Management Routes
@app.route('/api/admin/builders', methods=['GET'])
def get_admin_builders():
    # In a real app, this would require authentication
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM builders")
    builders = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    return jsonify(builders)

@app.route('/api/admin/builders', methods=['POST'])
def create_builder():
    # In a real app, this would require authentication
    data = request.get_json()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO builders (name, projects_count, image, description)
        VALUES (?, ?, ?, ?)
    ''', (data['name'], data.get('projects_count', 0), data.get('image', ''), data.get('description', '')))
    
    builder_id = cursor.lastrowid
    
    # Add notification for builder creation
    cursor.execute('''
        INSERT INTO notifications (type, message, admin_id, admin_name, created_at, read_status)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', ('builder', f'New builder added: {data["name"]}', 1, 'Admin User', datetime.now().isoformat(), 0))
    
    conn.commit()
    
    # Get the newly created builder
    cursor.execute("SELECT * FROM builders WHERE id = ?", (builder_id,))
    new_builder = cursor.fetchone()
    conn.close()
    
    return jsonify(dict(new_builder)), 201

@app.route('/api/admin/builders/<int:builder_id>', methods=['PUT'])
def update_builder(builder_id):
    # In a real app, this would require authentication
    data = request.get_json()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get current builder to get original name
    cursor.execute("SELECT * FROM builders WHERE id = ?", (builder_id,))
    current_builder = cursor.fetchone()
    if not current_builder:
        conn.close()
        return jsonify({'message': 'Builder not found'}), 404
    
    original_name = current_builder['name']
    
    # Prepare update fields
    update_fields = []
    params = []
    
    if 'name' in data:
        update_fields.append("name = ?")
        params.append(data['name'])
    if 'projects_count' in data:
        update_fields.append("projects_count = ?")
        params.append(data['projects_count'])
    if 'image' in data:
        update_fields.append("image = ?")
        params.append(data['image'])
    if 'description' in data:
        update_fields.append("description = ?")
        params.append(data['description'])
    
    if update_fields:
        update_query = f"UPDATE builders SET {', '.join(update_fields)} WHERE id = ?"
        params.append(builder_id)
        cursor.execute(update_query, params)
        
        # Add notification for builder update
        cursor.execute('''
            INSERT INTO notifications (type, message, admin_id, admin_name, created_at, read_status)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', ('builder', f'Builder updated: {data.get("name", original_name)}', 1, 'Admin User', datetime.now().isoformat(), 0))
    
    conn.commit()
    
    # Get updated builder
    cursor.execute("SELECT * FROM builders WHERE id = ?", (builder_id,))
    updated_builder = cursor.fetchone()
    conn.close()
    
    return jsonify(dict(updated_builder))

@app.route('/api/admin/builders/<int:builder_id>', methods=['DELETE'])
def delete_builder(builder_id):
    # In a real app, this would require authentication
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM builders WHERE id = ?", (builder_id,))
    builder = cursor.fetchone()
    if not builder:
        conn.close()
        return jsonify({'message': 'Builder not found'}), 404
    
    # Remove builder
    cursor.execute("DELETE FROM builders WHERE id = ?", (builder_id,))
    
    # Add notification for builder deletion
    cursor.execute('''
        INSERT INTO notifications (type, message, admin_id, admin_name, created_at, read_status)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', ('builder', f'Builder deleted: {builder["name"]}', 1, 'Admin User', datetime.now().isoformat(), 0))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Builder deleted successfully'})

# Project Routes
@app.route('/api/projects', methods=['GET'])
def get_projects():
    # Get query parameters for filtering
    status = request.args.get('status')
    location = request.args.get('location')
    tag = request.args.get('tag')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = "SELECT * FROM projects"
    params = []
    
    conditions = []
    if status:
        conditions.append("status = ?")
        params.append(status)
    
    if location:
        conditions.append("location LIKE ?")
        params.append(f'%{location}%')
    
    if tag:
        conditions.append("tag = ?")
        params.append(tag)
    
    if conditions:
        query += " WHERE " + " AND ".join(conditions)
    
    cursor.execute(query, params)
    projects = cursor.fetchall()
    
    # Get builder names for each project
    result = []
    for project in projects:
        proj_dict = dict(project)
        # Convert images from JSON string to list
        try:
            proj_dict['images'] = json.loads(proj_dict['images']) if proj_dict['images'] else []
        except:
            proj_dict['images'] = []
        
        # Get builder name if builder_id exists
        if proj_dict['builder_id']:
            cursor.execute("SELECT name FROM builders WHERE id = ?", (proj_dict['builder_id'],))
            builder = cursor.fetchone()
            if builder:
                proj_dict['builder_name'] = builder['name']
            else:
                proj_dict['builder_name'] = ""
        else:
            proj_dict['builder_name'] = ""
        
        result.append(proj_dict)
    
    conn.close()
    return jsonify(result)

@app.route('/api/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
    project = cursor.fetchone()
    
    if project:
        proj_dict = dict(project)
        # Convert images from JSON string to list
        try:
            proj_dict['images'] = json.loads(proj_dict['images']) if proj_dict['images'] else []
        except:
            proj_dict['images'] = []
        
        # Get builder name if builder_id exists
        if proj_dict['builder_id']:
            cursor.execute("SELECT name FROM builders WHERE id = ?", (proj_dict['builder_id'],))
            builder = cursor.fetchone()
            if builder:
                proj_dict['builder_name'] = builder['name']
            else:
                proj_dict['builder_name'] = ""
        else:
            proj_dict['builder_name'] = ""
        
        conn.close()
        return jsonify(proj_dict)
    
    conn.close()
    return jsonify({'message': 'Project not found'}), 404

# Admin Project Management Routes
@app.route('/api/admin/projects', methods=['GET'])
def get_admin_projects():
    # In a real app, this would require authentication
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM projects")
    projects = cursor.fetchall()
    
    # Get builder names for each project
    result = []
    for project in projects:
        proj_dict = dict(project)
        # Convert images from JSON string to list
        try:
            proj_dict['images'] = json.loads(proj_dict['images']) if proj_dict['images'] else []
        except:
            proj_dict['images'] = []
        
        # Get builder name if builder_id exists
        if proj_dict['builder_id']:
            cursor.execute("SELECT name FROM builders WHERE id = ?", (proj_dict['builder_id'],))
            builder = cursor.fetchone()
            if builder:
                proj_dict['builder_name'] = builder['name']
            else:
                proj_dict['builder_name'] = ""
        else:
            proj_dict['builder_name'] = ""
        
        result.append(proj_dict)
    
    conn.close()
    return jsonify(result)

@app.route('/api/admin/projects', methods=['POST'])
def create_project():
    # In a real app, this would require authentication
    data = request.get_json()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get builder info if builder_id is provided
    builder_id = data.get('builder_id')
    builder_name = ""
    if builder_id:
        cursor.execute("SELECT name FROM builders WHERE id = ?", (builder_id,))
        builder = cursor.fetchone()
        if builder:
            builder_name = builder['name']
    
    # Convert images list to JSON string
    images_json = json.dumps(data.get('images', []))
    
    cursor.execute('''
        INSERT INTO projects (title, description, location, status, completion_date, 
        total_units, builder_id, images, tag, is_favorite, created_at, type, area, 
        price_range, address, city, state, pincode)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['title'], data.get('description', ''), data['location'], 
        data.get('status', 'Available'), data.get('completion_date', ''), 
        data.get('total_units', 0), builder_id, images_json, 
        data.get('tag', 'available'), data.get('is_favorite', False), 
        datetime.now().isoformat(), data.get('type', ''), 
        data.get('area', ''), data.get('price_range', ''), 
        data.get('address', ''), data.get('city', ''), 
        data.get('state', ''), data.get('pincode', '')
    ))
    
    project_id = cursor.lastrowid
    
    # Add notification for project creation
    cursor.execute('''
        INSERT INTO notifications (type, message, admin_id, admin_name, created_at, read_status)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', ('project', f'New project added: {data["title"]}', 1, 'Admin User', datetime.now().isoformat(), 0))
    
    conn.commit()
    
    # Get the newly created project
    cursor.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
    new_project = cursor.fetchone()
    conn.close()
    
    proj_dict = dict(new_project)
    # Convert images from JSON string to list
    try:
        proj_dict['images'] = json.loads(proj_dict['images']) if proj_dict['images'] else []
    except:
        proj_dict['images'] = []
    
    proj_dict['builder_name'] = builder_name
    
    return jsonify(proj_dict), 201

@app.route('/api/admin/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    # In a real app, this would require authentication
    data = request.get_json()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get current project to get original title
    cursor.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
    current_project = cursor.fetchone()
    if not current_project:
        conn.close()
        return jsonify({'message': 'Project not found'}), 404
    
    original_title = current_project['title']
    
    # Get builder info if builder_id is provided
    builder_id = data.get('builder_id')
    builder_name = current_project['builder_name'] if current_project['builder_name'] else ""
    if builder_id and builder_id != current_project['builder_id']:
        cursor.execute("SELECT name FROM builders WHERE id = ?", (builder_id,))
        builder = cursor.fetchone()
        if builder:
            builder_name = builder['name']
    
    # Prepare update fields
    update_fields = []
    params = []
    
    if 'title' in data:
        update_fields.append("title = ?")
        params.append(data['title'])
    if 'description' in data:
        update_fields.append("description = ?")
        params.append(data['description'])
    if 'location' in data:
        update_fields.append("location = ?")
        params.append(data['location'])
    if 'status' in data:
        update_fields.append("status = ?")
        params.append(data['status'])
    if 'completion_date' in data:
        update_fields.append("completion_date = ?")
        params.append(data['completion_date'])
    if 'total_units' in data:
        update_fields.append("total_units = ?")
        params.append(data['total_units'])
    if 'builder_id' in data:
        update_fields.append("builder_id = ?")
        params.append(data['builder_id'])
    if 'images' in data:
        # Convert images list to JSON string
        images_json = json.dumps(data['images'])
        update_fields.append("images = ?")
        params.append(images_json)
    if 'tag' in data:
        update_fields.append("tag = ?")
        params.append(data['tag'])
    if 'is_favorite' in data:
        update_fields.append("is_favorite = ?")
        params.append(data['is_favorite'])
    if 'type' in data:
        update_fields.append("type = ?")
        params.append(data['type'])
    if 'area' in data:
        update_fields.append("area = ?")
        params.append(data['area'])
    if 'price_range' in data:
        update_fields.append("price_range = ?")
        params.append(data['price_range'])
    if 'address' in data:
        update_fields.append("address = ?")
        params.append(data['address'])
    if 'city' in data:
        update_fields.append("city = ?")
        params.append(data['city'])
    if 'state' in data:
        update_fields.append("state = ?")
        params.append(data['state'])
    if 'pincode' in data:
        update_fields.append("pincode = ?")
        params.append(data['pincode'])
    
    if update_fields:
        update_query = f"UPDATE projects SET {', '.join(update_fields)} WHERE id = ?"
        params.append(project_id)
        cursor.execute(update_query, params)
        
        # Add notification for project update
        cursor.execute('''
            INSERT INTO notifications (type, message, admin_id, admin_name, created_at, read_status)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', ('project', f'Project updated: {data.get("title", original_title)}', 1, 'Admin User', datetime.now().isoformat(), 0))
    
    conn.commit()
    
    # Get updated project
    cursor.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
    updated_project = cursor.fetchone()
    
    # Get builder name for updated project
    updated_builder_name = ""
    if updated_project['builder_id']:
        cursor.execute("SELECT name FROM builders WHERE id = ?", (updated_project['builder_id'],))
        builder = cursor.fetchone()
        if builder:
            updated_builder_name = builder['name']
    
    conn.close()
    
    proj_dict = dict(updated_project)
    # Convert images from JSON string to list
    try:
        proj_dict['images'] = json.loads(proj_dict['images']) if proj_dict['images'] else []
    except:
        proj_dict['images'] = []
    
    proj_dict['builder_name'] = updated_builder_name
    
    return jsonify(proj_dict)

@app.route('/api/admin/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    # In a real app, this would require authentication
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
    project = cursor.fetchone()
    if not project:
        conn.close()
        return jsonify({'message': 'Project not found'}), 404
    
    # Remove project
    cursor.execute("DELETE FROM projects WHERE id = ?", (project_id,))
    
    # Add notification for project deletion
    cursor.execute('''
        INSERT INTO notifications (type, message, admin_id, admin_name, created_at, read_status)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', ('project', f'Project deleted: {project["title"]}', 1, 'Admin User', datetime.now().isoformat(), 0))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Project deleted successfully'})

@app.route('/api/admin/projects/<int:project_id>/favorite', methods=['PUT'])
def toggle_project_favorite(project_id):
    # In a real app, this would require authentication
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
    project = cursor.fetchone()
    if not project:
        conn.close()
        return jsonify({'message': 'Project not found'}), 404
    
    data = request.get_json()
    new_favorite_status = data.get('is_favorite', False)
    
    cursor.execute("UPDATE projects SET is_favorite = ? WHERE id = ?", (int(new_favorite_status), project_id))
    
    # Get updated project
    cursor.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
    updated_project = cursor.fetchone()
    
    # Add notification for favorite status change
    status_text = 'added to' if new_favorite_status else 'removed from'
    cursor.execute('''
        INSERT INTO notifications (type, message, admin_id, admin_name, created_at, read_status)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', ('project', f'Project {status_text} favorites: {updated_project["title"]}', 1, 'Admin User', datetime.now().isoformat(), 0))
    
    # Get builder name for updated project
    updated_builder_name = ""
    if updated_project['builder_id']:
        cursor.execute("SELECT name FROM builders WHERE id = ?", (updated_project['builder_id'],))
        builder = cursor.fetchone()
        if builder:
            updated_builder_name = builder['name']
    
    conn.commit()
    conn.close()
    
    proj_dict = dict(updated_project)
    # Convert images from JSON string to list
    try:
        proj_dict['images'] = json.loads(proj_dict['images']) if proj_dict['images'] else []
    except:
        proj_dict['images'] = []
    
    proj_dict['builder_name'] = updated_builder_name
    
    return jsonify(proj_dict)

# Home Content Management Routes
@app.route('/api/admin/home-content', methods=['GET'])
def get_home_content():
    # In a real app, this would require authentication
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM home_content")
    content_rows = cursor.fetchall()
    
    home_content = {}
    for row in content_rows:
        try:
            home_content[row['section']] = json.loads(row['content'])
        except:
            home_content[row['section']] = row['content']
    
    conn.close()
    return jsonify(home_content)

@app.route('/api/admin/home-content/<section>', methods=['PUT'])
def update_home_content(section):
    # In a real app, this would require authentication
    data = request.get_json()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if section exists
    cursor.execute("SELECT * FROM home_content WHERE section = ?", (section,))
    existing = cursor.fetchone()
    
    if existing:
        # Update existing section
        cursor.execute("UPDATE home_content SET content = ? WHERE section = ?", (json.dumps(data), section))
    else:
        # Insert new section
        cursor.execute("INSERT INTO home_content (section, content) VALUES (?, ?)", (section, json.dumps(data)))
    
    # Add notification for content update
    cursor.execute('''
        INSERT INTO notifications (type, message, admin_id, admin_name, created_at, read_status)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', ('content', f'Homepage {section} content updated', 1, 'Admin User', datetime.now().isoformat(), 0))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Content updated successfully'})

# Notification Routes
@app.route('/api/admin/notifications', methods=['GET'])
def get_notifications():
    # In a real app, this would require authentication
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM notifications ORDER BY created_at DESC")
    notifications = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    return jsonify(notifications)

@app.route('/api/admin/notifications/<int:notification_id>/read', methods=['PUT'])
def mark_notification_as_read(notification_id):
    # In a real app, this would require authentication
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("UPDATE notifications SET read_status = 1 WHERE id = ?", (notification_id,))
    
    if cursor.rowcount == 0:
        conn.close()
        return jsonify({'message': 'Notification not found'}), 404
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Notification marked as read'})

@app.route('/api/admin/notifications/read-all', methods=['PUT'])
def mark_all_notifications_as_read():
    # In a real app, this would require authentication
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("UPDATE notifications SET read_status = 1")
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'All notifications marked as read'})

# Inquiry Routes
@app.route('/api/inquiries', methods=['POST'])
def create_inquiry():
    data = request.get_json()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO inquiries (user_name, email, phone, property_id, message, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['user_name'], data['email'], data.get('phone', ''), 
        data.get('property_id'), data.get('message', ''), 
        'pending', datetime.now().isoformat()
    ))
    
    inquiry_id = cursor.lastrowid
    
    # Add notification for new inquiry
    cursor.execute('''
        INSERT INTO notifications (type, message, admin_id, admin_name, created_at, read_status)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', ('inquiry', f'New inquiry from {data["user_name"]}', 1, 'Admin User', datetime.now().isoformat(), 0))
    
    conn.commit()
    conn.close()
    
    return jsonify({
        'id': inquiry_id,
        'message': 'Inquiry submitted successfully'
    }), 201

@app.route('/api/admin/inquiries', methods=['GET'])
def get_inquiries():
    # In a real app, this would require authentication
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM inquiries ORDER BY created_at DESC")
    inquiries = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    return jsonify(inquiries)

@app.route('/api/admin/inquiries/<int:inquiry_id>/status', methods=['PUT'])
def update_inquiry_status(inquiry_id):
    # In a real app, this would require authentication
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM inquiries WHERE id = ?", (inquiry_id,))
    inquiry = cursor.fetchone()
    if not inquiry:
        conn.close()
        return jsonify({'message': 'Inquiry not found'}), 404
    
    data = request.get_json()
    new_status = data.get('status', 'pending')
    
    if new_status not in ['pending', 'solved']:
        conn.close()
        return jsonify({'message': 'Invalid status'}), 400
    
    cursor.execute("UPDATE inquiries SET status = ? WHERE id = ?", (new_status, inquiry_id))
    
    # Add notification for status change
    cursor.execute('''
        INSERT INTO notifications (type, message, admin_id, admin_name, created_at, read_status)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', ('inquiry', f'Inquiry #{inquiry_id} status changed to {new_status}', 1, 'Admin User', datetime.now().isoformat(), 0))
    
    conn.commit()
    conn.close()
    
    # Return the updated inquiry
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM inquiries WHERE id = ?", (inquiry_id,))
    updated_inquiry = cursor.fetchone()
    conn.close()
    
    return jsonify(dict(updated_inquiry))

if __name__ == '__main__':
    # Initialize the database
    init_db()
    
    # Use the PORT environment variable for deployment platforms like Heroku, Railway, etc.
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)