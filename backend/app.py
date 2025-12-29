from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
import hashlib
import uuid

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

# Simple in-memory data storage (for demo purposes)
admins = [
    {
        'id': 1,
        'name': 'Admin User',
        'email': 'admin@example.com',
        'password_hash': hashlib.sha256('admin123'.encode()).hexdigest(),
        'role': 'admin',
        'created_at': datetime.now().isoformat()
    }
]

# Notifications data
notifications = []

# Sample properties data with builder association
properties = [
    {
        'id': 1,
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
        'builder_name': 'DLF Limited',
        'is_favorite': False,
        'images': ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80'],
        'created_at': datetime.now().isoformat()
    },
    {
        'id': 2,
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
        'builder_name': 'Amrapali Group',
        'is_favorite': False,
        'images': ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'],
        'created_at': datetime.now().isoformat()
    },
    {
        'id': 3,
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
        'builder_name': 'DLF Limited',
        'is_favorite': False,
        'images': ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'],
        'created_at': datetime.now().isoformat()
    },
    {
        'id': 4,
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
        'builder_name': 'Godrej Properties',
        'is_favorite': False,
        'images': ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80'],
        'created_at': datetime.now().isoformat()
    },
    {
        'id': 5,
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
        'builder_name': 'Oberoi Realty',
        'is_favorite': False,
        'images': ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'],
        'created_at': datetime.now().isoformat()
    },
    {
        'id': 6,
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
        'builder_name': 'Tata Housing',
        'is_favorite': False,
        'images': ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'],
        'created_at': datetime.now().isoformat()
    }
]

inquiries = []

# Sample agents data
agents = [
    {
        'id': 1,
        'name': 'John Smith',
        'email': 'john.smith@megareality.com',
        'phone': '+91 98765 43210',
        'position': 'Senior Real Estate Agent',
        'experience': '8 years',
        'properties_sold': 120,
        'image': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        'bio': 'Specialized in luxury properties and commercial real estate with extensive knowledge of local market trends.',
        'is_favorite': False
    },
    {
        'id': 2,
        'name': 'Sarah Johnson',
        'email': 'sarah.johnson@megareality.com',
        'phone': '+91 98765 43211',
        'position': 'Residential Property Expert',
        'experience': '6 years',
        'properties_sold': 95,
        'image': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
        'bio': 'Focuses on residential properties with expertise in first-time home buyers and family housing.',
        'is_favorite': False
    },
    {
        'id': 3,
        'name': 'Michael Brown',
        'email': 'michael.brown@megareality.com',
        'phone': '+91 98765 43212',
        'position': 'Commercial Real Estate Specialist',
        'experience': '10 years',
        'properties_sold': 150,
        'image': 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
        'bio': 'Expert in commercial properties, office spaces, and retail locations with strong negotiation skills.',
        'is_favorite': False
    },
    {
        'id': 4,
        'name': 'Emily Davis',
        'email': 'emily.davis@megareality.com',
        'phone': '+91 98765 43213',
        'position': 'Property Investment Advisor',
        'experience': '7 years',
        'properties_sold': 110,
        'image': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
        'bio': 'Helps clients with property investment strategies and portfolio management for maximum ROI.',
        'is_favorite': False
    }
]

# Sample projects data
projects = [
    {
        'id': 1,
        'title': 'Skyline Heights',
        'description': 'Luxury residential towers with panoramic city views',
        'location': 'Sector 23, Gurugram, Haryana',
        'status': 'Available',
        'completion_date': '2025-12-31',
        'total_units': 120,
        'builder_id': 1,
        'builder_name': 'DLF Limited',
        'images': ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'],
        'tag': 'latest',
        'is_favorite': False,
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
        'id': 2,
        'title': 'Green Valley Apartments',
        'description': 'Eco-friendly residential complex with green spaces',
        'location': 'Sector 45, Gurugram, Haryana',
        'status': 'Working',
        'completion_date': '2026-06-30',
        'total_units': 80,
        'builder_id': 2,
        'builder_name': 'Amrapali Group',
        'images': ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'],
        'tag': 'working',
        'is_favorite': False,
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
        'id': 3,
        'title': 'Royal Enclave',
        'description': 'Premium gated community with luxury amenities',
        'location': 'South Delhi, New Delhi',
        'status': 'Available',
        'completion_date': '2024-05-15',
        'total_units': 200,
        'builder_id': 3,
        'builder_name': 'Godrej Properties',
        'images': ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'],
        'tag': 'available',
        'is_favorite': False,
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

# Sample top builders data
builders = [
    {
        'id': 1,
        'name': 'DLF Limited',
        'projects_count': 125,
        'image': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=400&fit=crop',
        'description': 'Leading real estate developer with projects across India'
    },
    {
        'id': 2,
        'name': 'Amrapali Group',
        'projects_count': 89,
        'image': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=400&fit=crop',
        'description': 'Premium residential and commercial property developer'
    },
    {
        'id': 3,
        'name': 'Godrej Properties',
        'projects_count': 156,
        'image': 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=400&fit=crop',
        'description': 'Innovative sustainable living solutions provider'
    },
    {
        'id': 4,
        'name': 'Prestige Estates',
        'projects_count': 98,
        'image': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=400&fit=crop',
        'description': 'Luxury residential and commercial developments'
    },
    {
        'id': 5,
        'name': 'Oberoi Realty',
        'projects_count': 72,
        'image': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop',
        'description': 'High-end luxury property developers'
    },
    {
        'id': 6,
        'name': 'Tata Housing',
        'projects_count': 112,
        'image': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=400&fit=crop',
        'description': 'Quality affordable and premium housing solutions'
    }
]

# Home Content Data
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
    
    # Find admin by email
    admin = None
    for a in admins:
        if a['email'] == email:
            admin = a
            break
    
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
    
    # Check if admin with this email already exists
    for admin in admins:
        if admin['email'] == data['email']:
            return jsonify({'message': 'Admin with this email already exists'}), 409
    
    # Create new admin
    new_admin = {
        'id': max([a['id'] for a in admins]) + 1 if admins else 1,
        'name': data['name'],
        'email': data['email'],
        'password_hash': hashlib.sha256(data['password'].encode()).hexdigest(),
        'role': data.get('role', 'admin'),
        'created_at': datetime.now().isoformat()
    }
    
    admins.append(new_admin)
    
    # Add notification for admin creation
    new_notification = {
        'id': max([n['id'] for n in notifications]) + 1 if notifications else 1,
        'type': 'admin',
        'message': f'New admin added: {data["name"]}',
        'admin_id': new_admin['id'],
        'admin_name': new_admin['name'],
        'created_at': datetime.now().isoformat(),
        'read': False
    }
    notifications.append(new_notification)
    
    # Return admin info without password hash
    admin_info = {
        'id': new_admin['id'],
        'name': new_admin['name'],
        'email': new_admin['email'],
        'role': new_admin['role'],
        'created_at': new_admin['created_at']
    }
    
    return jsonify(admin_info), 201

@app.route('/api/admins', methods=['GET'])
def get_admins():
    # Return all admins without password hashes
    admin_list = []
    for admin in admins:
        admin_info = {
            'id': admin['id'],
            'name': admin['name'],
            'email': admin['email'],
            'role': admin['role'],
            'created_at': admin['created_at']
        }
        admin_list.append(admin_info)
    
    return jsonify(admin_list)

@app.route('/api/admins/<int:admin_id>', methods=['PUT'])
def update_admin(admin_id):
    # Find admin by ID
    admin = next((a for a in admins if a['id'] == admin_id), None)
    if not admin:
        return jsonify({'message': 'Admin not found'}), 404
    
    data = request.get_json()
    
    # Update admin fields
    if 'name' in data:
        admin['name'] = data['name']
    if 'email' in data:
        # Check if email already exists for another admin
        if any(a['email'] == data['email'] and a['id'] != admin_id for a in admins):
            return jsonify({'message': 'Email already exists'}), 409
        admin['email'] = data['email']
    if 'role' in data:
        admin['role'] = data['role']
    if 'password' in data and data['password']:
        admin['password_hash'] = hashlib.sha256(data['password'].encode()).hexdigest()
    
    original_name = admin['name']
    
    # Add notification for admin update
    new_notification = {
        'id': max([n['id'] for n in notifications]) + 1 if notifications else 1,
        'type': 'admin',
        'message': f'Admin updated: {original_name}',
        'admin_id': admin['id'],
        'admin_name': admin['name'],
        'created_at': datetime.now().isoformat(),
        'read': False
    }
    notifications.append(new_notification)
    
    # Return updated admin info
    admin_info = {
        'id': admin['id'],
        'name': admin['name'],
        'email': admin['email'],
        'role': admin['role'],
        'created_at': admin['created_at']
    }
    
    return jsonify(admin_info)

@app.route('/api/admins/<int:admin_id>', methods=['DELETE'])
def delete_admin(admin_id):
    global admins
    # Cannot delete the last admin
    if len(admins) <= 1:
        return jsonify({'message': 'Cannot delete the last admin'}), 400
    
    # Find admin by ID
    admin = next((a for a in admins if a['id'] == admin_id), None)
    if not admin:
        return jsonify({'message': 'Admin not found'}), 404
    
    deleted_admin = next((a for a in admins if a['id'] == admin_id), None)
    
    # Remove admin
    admins = [a for a in admins if a['id'] != admin_id]
    
    # Add notification for admin deletion
    if deleted_admin:
        new_notification = {
            'id': max([n['id'] for n in notifications]) + 1 if notifications else 1,
            'type': 'admin',
            'message': f'Admin deleted: {deleted_admin["name"]}',
            'admin_id': deleted_admin['id'],
            'admin_name': deleted_admin['name'],
            'created_at': datetime.now().isoformat(),
            'read': False
        }
        notifications.append(new_notification)
    
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
    
    # Filter properties
    filtered_properties = properties.copy()
    
    if property_type:
        filtered_properties = [p for p in filtered_properties if p['property_type'] == property_type]
    
    if location:
        filtered_properties = [p for p in filtered_properties if location.lower() in p['location'].lower()]
    
    if status:
        filtered_properties = [p for p in filtered_properties if p['status'] == status]
    
    if min_price:
        filtered_properties = [p for p in filtered_properties if p['price'] >= float(min_price)]
    
    if max_price:
        filtered_properties = [p for p in filtered_properties if p['price'] <= float(max_price)]
    
    return jsonify(filtered_properties)

@app.route('/api/properties/<int:property_id>', methods=['GET'])
def get_property(property_id):
    property = next((p for p in properties if p['id'] == property_id), None)
    if property:
        return jsonify(property)
    return jsonify({'message': 'Property not found'}), 404

# Protected Admin Routes
@app.route('/api/admin/properties', methods=['GET'])
def get_admin_properties():
    # In a real app, this would require authentication
    return jsonify(properties)

@app.route('/api/admin/properties', methods=['POST'])
def create_property():
    # In a real app, this would require authentication
    data = request.get_json()
    
    # Get builder info if builder_id is provided
    builder_id = data.get('builder_id')
    builder_name = ""
    if builder_id:
        builder = next((b for b in builders if b['id'] == builder_id), None)
        if builder:
            builder_name = builder['name']
    
    new_property = {
        'id': max([p['id'] for p in properties]) + 1 if properties else 1,
        'title': data['title'],
        'description': data.get('description', ''),
        'price': float(data['price']),
        'location': data['location'],
        'property_type': data['property_type'],
        'status': data.get('status', 'Available'),
        'bedrooms': data.get('bedrooms', 0),
        'bathrooms': data.get('bathrooms', 0),
        'area_sqft': data.get('area_sqft', 0),
        'builder_id': builder_id,
        'builder_name': builder_name,
        'is_favorite': data.get('is_favorite', False),
        'images': data.get('images', []),
        'created_at': datetime.now().isoformat()
    }
    
    properties.append(new_property)
    
    # Add notification for property creation
    new_notification = {
        'id': max([n['id'] for n in notifications]) + 1 if notifications else 1,
        'type': 'property',
        'message': f'New property added: {data["title"]}',
        'admin_id': 1,  # Default admin for demo
        'admin_name': 'Admin User',
        'created_at': datetime.now().isoformat(),
        'read': False
    }
    notifications.append(new_notification)
    
    return jsonify(new_property), 201

@app.route('/api/admin/properties/<int:property_id>', methods=['PUT'])
def update_property(property_id):
    # In a real app, this would require authentication
    property = next((p for p in properties if p['id'] == property_id), None)
    if not property:
        return jsonify({'message': 'Property not found'}), 404
    
    data = request.get_json()
    
    # Get builder info if builder_id is provided
    builder_id = data.get('builder_id')
    builder_name = property['builder_name']
    if builder_id and builder_id != property['builder_id']:
        builder = next((b for b in builders if b['id'] == builder_id), None)
        if builder:
            builder_name = builder['name']
    
    original_title = property['title']
    property['title'] = data.get('title', property['title'])
    property['description'] = data.get('description', property['description'])
    property['price'] = data.get('price', property['price'])
    property['location'] = data.get('location', property['location'])
    property['property_type'] = data.get('property_type', property['property_type'])
    property['status'] = data.get('status', property['status'])
    property['bedrooms'] = data.get('bedrooms', property['bedrooms'])
    property['bathrooms'] = data.get('bathrooms', property['bathrooms'])
    property['area_sqft'] = data.get('area_sqft', property['area_sqft'])
    property['builder_id'] = builder_id if builder_id is not None else property['builder_id']
    property['builder_name'] = builder_name
    property['images'] = data.get('images', property['images'])
    
    # Add notification for property update
    new_notification = {
        'id': max([n['id'] for n in notifications]) + 1 if notifications else 1,
        'type': 'property',
        'message': f'Property updated: {original_title}',
        'admin_id': 1,  # Default admin for demo
        'admin_name': 'Admin User',
        'created_at': datetime.now().isoformat(),
        'read': False
    }
    notifications.append(new_notification)
    
    return jsonify(property)

@app.route('/api/admin/properties/<int:property_id>', methods=['DELETE'])
def delete_property(property_id):
    # In a real app, this would require authentication
    global properties
    property = next((p for p in properties if p['id'] == property_id), None)
    if not property:
        return jsonify({'message': 'Property not found'}), 404
    
    deleted_property = next((p for p in properties if p['id'] == property_id), None)
    properties = [p for p in properties if p['id'] != property_id]
    
    # Add notification for property deletion
    if deleted_property:
        new_notification = {
            'id': max([n['id'] for n in notifications]) + 1 if notifications else 1,
            'type': 'property',
            'message': f'Property deleted: {deleted_property["title"]}',
            'admin_id': 1,  # Default admin for demo
            'admin_name': 'Admin User',
            'created_at': datetime.now().isoformat(),
            'read': False
        }
        notifications.append(new_notification)
    
    return jsonify({'message': 'Property deleted successfully'})

@app.route('/api/admin/properties/<int:property_id>/favorite', methods=['PUT'])
def toggle_property_favorite(property_id):
    # In a real app, this would require authentication
    property = next((p for p in properties if p['id'] == property_id), None)
    if not property:
        return jsonify({'message': 'Property not found'}), 404
    
    data = request.get_json()
    new_favorite_status = data.get('is_favorite', False)
    
    property['is_favorite'] = new_favorite_status
    
    # Add notification for favorite status change
    status_text = 'added to' if new_favorite_status else 'removed from'
    new_notification = {
        'id': max([n['id'] for n in notifications]) + 1 if notifications else 1,
        'type': 'property',
        'message': f'Property {status_text} favorites: {property["title"]}',
        'admin_id': 1,  # Default admin for demo
        'admin_name': 'Admin User',
        'created_at': datetime.now().isoformat(),
        'read': False
    }
    notifications.append(new_notification)
    
    return jsonify(property)

# Agent Routes
@app.route('/api/agents', methods=['GET'])
def get_agents():
    # Get query parameters for filtering
    search_name = request.args.get('name')
    
    # Filter agents
    filtered_agents = agents.copy()
    
    if search_name:
        filtered_agents = [a for a in filtered_agents if search_name.lower() in a['name'].lower()]
    
    return jsonify(filtered_agents)

@app.route('/api/agents/<int:agent_id>', methods=['GET'])
def get_agent(agent_id):
    agent = next((a for a in agents if a['id'] == agent_id), None)
    if agent:
        return jsonify(agent)
    return jsonify({'message': 'Agent not found'}), 404

# Admin Agent Management Routes
@app.route('/api/admin/agents', methods=['GET'])
def get_admin_agents():
    # In a real app, this would require authentication
    return jsonify(agents)

@app.route('/api/admin/agents', methods=['POST'])
def create_agent():
    # In a real app, this would require authentication
    data = request.get_json()
    
    new_agent = {
        'id': max([a['id'] for a in agents]) + 1 if agents else 1,
        'name': data['name'],
        'email': data.get('email', ''),
        'phone': data.get('phone', ''),
        'position': data.get('position', ''),
        'experience': data.get('experience', ''),
        'properties_sold': data.get('properties_sold', 0),
        'image': data.get('image', ''),
        'bio': data.get('bio', ''),
        'is_favorite': data.get('is_favorite', False)
    }
    
    agents.append(new_agent)
    
    # Add notification for agent creation
    new_notification = {
        'id': max([n['id'] for n in notifications]) + 1 if notifications else 1,
        'type': 'agent',
        'message': f'New agent added: {data["name"]}',
        'admin_id': 1,  # Default admin for demo
        'admin_name': 'Admin User',
        'created_at': datetime.now().isoformat(),
        'read': False
    }
    notifications.append(new_notification)
    
    return jsonify(new_agent), 201

@app.route('/api/admin/agents/<int:agent_id>', methods=['PUT'])
def update_agent(agent_id):
    # In a real app, this would require authentication
    agent = next((a for a in agents if a['id'] == agent_id), None)
    if not agent:
        return jsonify({'message': 'Agent not found'}), 404
    
    data = request.get_json()
    
    original_name = agent['name']
    agent['name'] = data.get('name', agent['name'])
    agent['email'] = data.get('email', agent['email'])
    agent['phone'] = data.get('phone', agent['phone'])
    agent['position'] = data.get('position', agent['position'])
    agent['experience'] = data.get('experience', agent['experience'])
    agent['properties_sold'] = data.get('properties_sold', agent['properties_sold'])
    agent['image'] = data.get('image', agent['image'])
    agent['bio'] = data.get('bio', agent['bio'])
    
    # Add notification for agent update
    new_notification = {
        'id': max([n['id'] for n in notifications]) + 1 if notifications else 1,
        'type': 'agent',
        'message': f'Agent updated: {original_name}',
        'admin_id': 1,  # Default admin for demo
        'admin_name': 'Admin User',
        'created_at': datetime.now().isoformat(),
        'read': False
    }
    notifications.append(new_notification)
    
    return jsonify(agent)

@app.route('/api/admin/agents/<int:agent_id>', methods=['DELETE'])
def delete_agent(agent_id):
    # In a real app, this would require authentication
    global agents
    agent = next((a for a in agents if a['id'] == agent_id), None)
    if not agent:
        return jsonify({'message': 'Agent not found'}), 404
    
    deleted_agent = next((a for a in agents if a['id'] == agent_id), None)
    agents = [a for a in agents if a['id'] != agent_id]
    
    # Add notification for agent deletion
    if deleted_agent:
        new_notification = {
            'id': max([n['id'] for n in notifications]) + 1 if notifications else 1,
            'type': 'agent',
            'message': f'Agent deleted: {deleted_agent["name"]}',
            'admin_id': 1,  # Default admin for demo
            'admin_name': 'Admin User',
            'created_at': datetime.now().isoformat(),
            'read': False
        }
        notifications.append(new_notification)
    
    return jsonify({'message': 'Agent deleted successfully'})

@app.route('/api/admin/agents/<int:agent_id>/favorite', methods=['PUT'])
def toggle_agent_favorite(agent_id):
    # In a real app, this would require authentication
    agent = next((a for a in agents if a['id'] == agent_id), None)
    if not agent:
        return jsonify({'message': 'Agent not found'}), 404
    
    data = request.get_json()
    new_favorite_status = data.get('is_favorite', False)
    
    agent['is_favorite'] = new_favorite_status
    
    # Add notification for favorite status change
    status_text = 'added to' if new_favorite_status else 'removed from'
    new_notification = {
        'id': max([n['id'] for n in notifications]) + 1 if notifications else 1,
        'type': 'agent',
        'message': f'Agent {status_text} favorites: {agent["name"]}',
        'admin_id': 1,  # Default admin for demo
        'admin_name': 'Admin User',
        'created_at': datetime.now().isoformat(),
        'read': False
    }
    notifications.append(new_notification)
    
    return jsonify(agent)

# Builder Routes
@app.route('/api/builders', methods=['GET'])
def get_builders():
    return jsonify(builders)

@app.route('/api/builders/<int:builder_id>', methods=['GET'])
def get_builder(builder_id):
    builder = next((b for b in builders if b['id'] == builder_id), None)
    if builder:
        return jsonify(builder)
    return jsonify({'message': 'Builder not found'}), 404

# Admin Builder Management Routes
@app.route('/api/admin/builders', methods=['GET'])
def get_admin_builders():
    # In a real app, this would require authentication
    return jsonify(builders)

@app.route('/api/admin/builders', methods=['POST'])
def create_builder():
    # In a real app, this would require authentication
    data = request.get_json()
    
    new_builder = {
        'id': max([b['id'] for b in builders]) + 1 if builders else 1,
        'name': data['name'],
        'projects_count': data.get('projects_count', 0),
        'image': data.get('image', ''),
        'description': data.get('description', '')
    }
    
    builders.append(new_builder)
    
    # Add notification for builder creation
    new_notification = {
        'id': max([n['id'] for n in notifications]) + 1 if notifications else 1,
        'type': 'builder',
        'message': f'New builder added: {data["name"]}',
        'admin_id': 1,  # Default admin for demo
        'admin_name': 'Admin User',
        'created_at': datetime.now().isoformat(),
        'read': False
    }
    notifications.append(new_notification)
    
    return jsonify(new_builder), 201

@app.route('/api/admin/builders/<int:builder_id>', methods=['PUT'])
def update_builder(builder_id):
    # In a real app, this would require authentication
    builder = next((b for b in builders if b['id'] == builder_id), None)
    if not builder:
        return jsonify({'message': 'Builder not found'}), 404
    
    data = request.get_json()
    
    original_name = builder['name']
    builder['name'] = data.get('name', builder['name'])
    builder['projects_count'] = data.get('projects_count', builder['projects_count'])
    builder['image'] = data.get('image', builder['image'])
    builder['description'] = data.get('description', builder['description'])
    
    # Add notification for builder update
    new_notification = {
        'id': max([n['id'] for n in notifications]) + 1 if notifications else 1,
        'type': 'builder',
        'message': f'Builder updated: {original_name}',
        'admin_id': 1,  # Default admin for demo
        'admin_name': 'Admin User',
        'created_at': datetime.now().isoformat(),
        'read': False
    }
    notifications.append(new_notification)
    
    return jsonify(builder)

@app.route('/api/admin/builders/<int:builder_id>', methods=['DELETE'])
def delete_builder(builder_id):
    # In a real app, this would require authentication
    global builders
    builder = next((b for b in builders if b['id'] == builder_id), None)
    if not builder:
        return jsonify({'message': 'Builder not found'}), 404
    
    deleted_builder = next((b for b in builders if b['id'] == builder_id), None)
    builders = [b for b in builders if b['id'] != builder_id]
    
    # Add notification for builder deletion
    if deleted_builder:
        new_notification = {
            'id': max([n['id'] for n in notifications]) + 1 if notifications else 1,
            'type': 'builder',
            'message': f'Builder deleted: {deleted_builder["name"]}',
            'admin_id': 1,  # Default admin for demo
            'admin_name': 'Admin User',
            'created_at': datetime.now().isoformat(),
            'read': False
        }
        notifications.append(new_notification)
    
    return jsonify({'message': 'Builder deleted successfully'})

# Project Routes
@app.route('/api/projects', methods=['GET'])
def get_projects():
    # Get query parameters for filtering
    status = request.args.get('status')
    location = request.args.get('location')
    tag = request.args.get('tag')
    
    # Filter projects
    filtered_projects = projects.copy()
    
    if status:
        filtered_projects = [p for p in filtered_projects if p['status'].lower() == status.lower()]
    
    if location:
        filtered_projects = [p for p in filtered_projects if location.lower() in p['location'].lower()]
    
    if tag:
        filtered_projects = [p for p in filtered_projects if p['tag'].lower() == tag.lower()]
    
    return jsonify(filtered_projects)

@app.route('/api/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    project = next((p for p in projects if p['id'] == project_id), None)
    if project:
        return jsonify(project)
    return jsonify({'message': 'Project not found'}), 404

# Admin Project Management Routes
@app.route('/api/admin/projects', methods=['GET'])
def get_admin_projects():
    # In a real app, this would require authentication
    return jsonify(projects)

@app.route('/api/admin/projects', methods=['POST'])
def create_project():
    # In a real app, this would require authentication
    data = request.get_json()
    
    # Get builder info if builder_id is provided
    builder_id = data.get('builder_id')
    builder_name = ""
    if builder_id:
        builder = next((b for b in builders if b['id'] == builder_id), None)
        if builder:
            builder_name = builder['name']
    
    new_project = {
        'id': max([p['id'] for p in projects]) + 1 if projects else 1,
        'title': data['title'],
        'description': data.get('description', ''),
        'location': data['location'],
        'status': data.get('status', 'Available'),
        'completion_date': data.get('completion_date', ''),
        'total_units': data.get('total_units', 0),
        'builder_id': builder_id,
        'builder_name': builder_name,
        'images': data.get('images', []),
        'tag': data.get('tag', 'available'),
        'is_favorite': data.get('is_favorite', False),
        'created_at': datetime.now().isoformat(),
        'type': data.get('type', ''),
        'area': data.get('area', ''),
        'price_range': data.get('price_range', ''),
        'address': data.get('address', ''),
        'city': data.get('city', ''),
        'state': data.get('state', ''),
        'pincode': data.get('pincode', '')
    }
    
    projects.append(new_project)
    
    # Add notification for project creation
    new_notification = {
        'id': max([n['id'] for n in notifications]) + 1 if notifications else 1,
        'type': 'project',
        'message': f'New project added: {data["title"]}',
        'admin_id': 1,  # Default admin for demo
        'admin_name': 'Admin User',
        'created_at': datetime.now().isoformat(),
        'read': False
    }
    notifications.append(new_notification)
    
    return jsonify(new_project), 201

@app.route('/api/admin/projects/<int:project_id>', methods=['PUT'])
def update_project(project_id):
    # In a real app, this would require authentication
    project = next((p for p in projects if p['id'] == project_id), None)
    if not project:
        return jsonify({'message': 'Project not found'}), 404
    
    data = request.get_json()
    
    # Get builder info if builder_id is provided
    builder_id = data.get('builder_id')
    builder_name = project['builder_name']
    if builder_id and builder_id != project['builder_id']:
        builder = next((b for b in builders if b['id'] == builder_id), None)
        if builder:
            builder_name = builder['name']
    
    original_title = project['title']
    project['title'] = data.get('title', project['title'])
    project['description'] = data.get('description', project['description'])
    project['location'] = data.get('location', project['location'])
    project['status'] = data.get('status', project['status'])
    project['completion_date'] = data.get('completion_date', project['completion_date'])
    project['total_units'] = data.get('total_units', project['total_units'])
    project['builder_id'] = builder_id if builder_id is not None else project['builder_id']
    project['builder_name'] = builder_name
    project['images'] = data.get('images', project['images'])
    project['tag'] = data.get('tag', project['tag'])
    project['type'] = data.get('type', project['type'])
    project['area'] = data.get('area', project['area'])
    project['price_range'] = data.get('price_range', project['price_range'])
    project['address'] = data.get('address', project['address'])
    project['city'] = data.get('city', project['city'])
    project['state'] = data.get('state', project['state'])
    project['pincode'] = data.get('pincode', project['pincode'])
    
    # Add notification for project update
    new_notification = {
        'id': max([n['id'] for n in notifications]) + 1 if notifications else 1,
        'type': 'project',
        'message': f'Project updated: {original_title}',
        'admin_id': 1,  # Default admin for demo
        'admin_name': 'Admin User',
        'created_at': datetime.now().isoformat(),
        'read': False
    }
    notifications.append(new_notification)
    
    return jsonify(project)

@app.route('/api/admin/projects/<int:project_id>', methods=['DELETE'])
def delete_project(project_id):
    # In a real app, this would require authentication
    global projects
    project = next((p for p in projects if p['id'] == project_id), None)
    if not project:
        return jsonify({'message': 'Project not found'}), 404
    
    deleted_project = next((p for p in projects if p['id'] == project_id), None)
    projects = [p for p in projects if p['id'] != project_id]
    
    # Add notification for project deletion
    if deleted_project:
        new_notification = {
            'id': max([n['id'] for n in notifications]) + 1 if notifications else 1,
            'type': 'project',
            'message': f'Project deleted: {deleted_project["title"]}',
            'admin_id': 1,  # Default admin for demo
            'admin_name': 'Admin User',
            'created_at': datetime.now().isoformat(),
            'read': False
        }
        notifications.append(new_notification)
    
    return jsonify({'message': 'Project deleted successfully'})

@app.route('/api/admin/projects/<int:project_id>/favorite', methods=['PUT'])
def toggle_project_favorite(project_id):
    # In a real app, this would require authentication
    project = next((p for p in projects if p['id'] == project_id), None)
    if not project:
        return jsonify({'message': 'Project not found'}), 404
    
    data = request.get_json()
    new_favorite_status = data.get('is_favorite', False)
    
    project['is_favorite'] = new_favorite_status
    
    # Add notification for favorite status change
    status_text = 'added to' if new_favorite_status else 'removed from'
    new_notification = {
        'id': max([n['id'] for n in notifications]) + 1 if notifications else 1,
        'type': 'project',
        'message': f'Project {status_text} favorites: {project["title"]}',
        'admin_id': 1,  # Default admin for demo
        'admin_name': 'Admin User',
        'created_at': datetime.now().isoformat(),
        'read': False
    }
    notifications.append(new_notification)
    
    return jsonify(project)

# Home Content Management Routes
@app.route('/api/admin/home-content', methods=['GET'])
def get_home_content():
    # In a real app, this would require authentication
    return jsonify(home_content)

@app.route('/api/admin/home-content/<section>', methods=['PUT'])
def update_home_content(section):
    # In a real app, this would require authentication
    global home_content
    
    # Check if the section exists in the home_content
    if section not in home_content:
        # If the section doesn't exist, create it
        home_content[section] = {}
    
    data = request.get_json()
    
    # Update the specific section
    if isinstance(home_content[section], dict) and isinstance(data, dict):
        home_content[section].update(data)
    else:
        # If the data types don't match, replace entirely
        home_content[section] = data
    
    # Add notification for content update
    new_notification = {
        'id': max([n['id'] for n in notifications]) + 1 if notifications else 1,
        'type': 'content',
        'message': f'Homepage {section} content updated',
        'admin_id': 1,  # Default admin for demo
        'admin_name': 'Admin User',
        'created_at': datetime.now().isoformat(),
        'read': False
    }
    notifications.append(new_notification)
    
    return jsonify(home_content)

# Notification Routes
@app.route('/api/admin/notifications', methods=['GET'])
def get_notifications():
    # In a real app, this would require authentication
    # Sort notifications by creation date (newest first)
    sorted_notifications = sorted(notifications, key=lambda x: x['created_at'], reverse=True)
    return jsonify(sorted_notifications)

@app.route('/api/admin/notifications/<int:notification_id>/read', methods=['PUT'])
def mark_notification_as_read(notification_id):
    # In a real app, this would require authentication
    notification = next((n for n in notifications if n['id'] == notification_id), None)
    if not notification:
        return jsonify({'message': 'Notification not found'}), 404
    
    notification['read'] = True
    return jsonify({'message': 'Notification marked as read'})

@app.route('/api/admin/notifications/read-all', methods=['PUT'])
def mark_all_notifications_as_read():
    # In a real app, this would require authentication
    for notification in notifications:
        notification['read'] = True
    return jsonify({'message': 'All notifications marked as read'})


# Inquiry Routes
@app.route('/api/inquiries', methods=['POST'])
def create_inquiry():
    data = request.get_json()
    
    new_inquiry = {
        'id': max([i['id'] for i in inquiries]) + 1 if inquiries else 1,
        'user_name': data['user_name'],
        'email': data['email'],
        'phone': data.get('phone', ''),
        'property_id': data.get('property_id'),
        'message': data.get('message', ''),
        'status': 'pending',
        'created_at': datetime.now().isoformat()
    }
    
    inquiries.append(new_inquiry)
    # Add notification for new inquiry
    new_notification = {
        'id': max([n['id'] for n in notifications]) + 1 if notifications else 1,
        'type': 'inquiry',
        'message': f'New inquiry from {data["user_name"]}',
        'admin_id': 1,  # Default admin for demo
        'admin_name': 'Admin User',
        'created_at': datetime.now().isoformat(),
        'read': False
    }
    notifications.append(new_notification)
    
    return jsonify({
        'id': new_inquiry['id'],
        'message': 'Inquiry submitted successfully'
    }), 201

@app.route('/api/admin/inquiries', methods=['GET'])
def get_inquiries():
    # In a real app, this would require authentication
    return jsonify(inquiries)

@app.route('/api/admin/inquiries/<int:inquiry_id>/status', methods=['PUT'])
def update_inquiry_status(inquiry_id):
    # In a real app, this would require authentication
    inquiry = next((i for i in inquiries if i['id'] == inquiry_id), None)
    if not inquiry:
        return jsonify({'message': 'Inquiry not found'}), 404
    
    data = request.get_json()
    new_status = data.get('status', 'pending')
    
    if new_status not in ['pending', 'solved']:
        return jsonify({'message': 'Invalid status'}), 400
    
    inquiry['status'] = new_status
    
    # Add notification for status change
    new_notification = {
        'id': max([n['id'] for n in notifications]) + 1 if notifications else 1,
        'type': 'inquiry',
        'message': f'Inquiry #{inquiry_id} status changed to {new_status}',
        'admin_id': 1,
        'admin_name': 'Admin User',
        'created_at': datetime.now().isoformat(),
        'read': False
    }
    notifications.append(new_notification)
    
    return jsonify(inquiry)

if __name__ == '__main__':
    # Use the PORT environment variable for deployment platforms like Heroku, Railway, etc.
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)