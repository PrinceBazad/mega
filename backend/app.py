from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
import hashlib

app = Flask(__name__)
CORS(app)

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
        'images': ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80'],
        'created_at': datetime.now().isoformat()
    }
]

inquiries = []

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
        'id': len(admins) + 1,
        'name': data['name'],
        'email': data['email'],
        'password_hash': hashlib.sha256(data['password'].encode()).hexdigest(),
        'role': data.get('role', 'admin'),
        'created_at': datetime.now().isoformat()
    }
    
    admins.append(new_admin)
    
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
    
    new_property = {
        'id': len(properties) + 1,
        'title': data['title'],
        'description': data.get('description', ''),
        'price': float(data['price']),
        'location': data['location'],
        'property_type': data['property_type'],
        'status': data.get('status', 'Available'),
        'bedrooms': data.get('bedrooms', 0),
        'bathrooms': data.get('bathrooms', 0),
        'area_sqft': data.get('area_sqft', 0),
        'images': data.get('images', []),
        'created_at': datetime.now().isoformat()
    }
    
    properties.append(new_property)
    return jsonify(new_property), 201

@app.route('/api/admin/properties/<int:property_id>', methods=['PUT'])
def update_property(property_id):
    # In a real app, this would require authentication
    property = next((p for p in properties if p['id'] == property_id), None)
    if not property:
        return jsonify({'message': 'Property not found'}), 404
    
    data = request.get_json()
    
    property['title'] = data.get('title', property['title'])
    property['description'] = data.get('description', property['description'])
    property['price'] = data.get('price', property['price'])
    property['location'] = data.get('location', property['location'])
    property['property_type'] = data.get('property_type', property['property_type'])
    property['status'] = data.get('status', property['status'])
    property['bedrooms'] = data.get('bedrooms', property['bedrooms'])
    property['bathrooms'] = data.get('bathrooms', property['bathrooms'])
    property['area_sqft'] = data.get('area_sqft', property['area_sqft'])
    property['images'] = data.get('images', property['images'])
    
    return jsonify(property)

@app.route('/api/admin/properties/<int:property_id>', methods=['DELETE'])
def delete_property(property_id):
    # In a real app, this would require authentication
    global properties
    property = next((p for p in properties if p['id'] == property_id), None)
    if not property:
        return jsonify({'message': 'Property not found'}), 404
    
    properties = [p for p in properties if p['id'] != property_id]
    return jsonify({'message': 'Property deleted successfully'})

# Inquiry Routes
@app.route('/api/inquiries', methods=['POST'])
def create_inquiry():
    data = request.get_json()
    
    new_inquiry = {
        'id': len(inquiries) + 1,
        'user_name': data['user_name'],
        'email': data['email'],
        'phone': data.get('phone', ''),
        'property_id': data.get('property_id'),
        'message': data.get('message', ''),
        'created_at': datetime.now().isoformat()
    }
    
    inquiries.append(new_inquiry)
    return jsonify({
        'id': new_inquiry['id'],
        'message': 'Inquiry submitted successfully'
    }), 201

@app.route('/api/admin/inquiries', methods=['GET'])
def get_inquiries():
    # In a real app, this would require authentication
    return jsonify(inquiries)

if __name__ == '__main__':
    # Use the PORT environment variable for deployment platforms like Heroku, Railway, etc.
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)