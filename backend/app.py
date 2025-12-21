from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
import hashlib
import uuid

app = Flask(__name__)
CORS(app)

# Add explicit CORS handling for all routes
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Handle OPTIONS requests explicitly
@app.before_request
def handle_options():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'OK'}), 200

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
        'bio': 'Specialized in luxury properties and commercial real estate with extensive knowledge of local market trends.'
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
        'bio': 'Focuses on residential properties with expertise in first-time home buyers and family housing.'
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
        'bio': 'Expert in commercial properties, office spaces, and retail locations with strong negotiation skills.'
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
        'bio': 'Helps clients with property investment strategies and portfolio management for maximum ROI.'
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
    
    # Remove admin
    admins = [a for a in admins if a['id'] != admin_id]
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
        'bio': data.get('bio', '')
    }
    
    agents.append(new_agent)
    return jsonify(new_agent), 201

@app.route('/api/admin/agents/<int:agent_id>', methods=['PUT'])
def update_agent(agent_id):
    # In a real app, this would require authentication
    agent = next((a for a in agents if a['id'] == agent_id), None)
    if not agent:
        return jsonify({'message': 'Agent not found'}), 404
    
    data = request.get_json()
    
    agent['name'] = data.get('name', agent['name'])
    agent['email'] = data.get('email', agent['email'])
    agent['phone'] = data.get('phone', agent['phone'])
    agent['position'] = data.get('position', agent['position'])
    agent['experience'] = data.get('experience', agent['experience'])
    agent['properties_sold'] = data.get('properties_sold', agent['properties_sold'])
    agent['image'] = data.get('image', agent['image'])
    agent['bio'] = data.get('bio', agent['bio'])
    
    return jsonify(agent)

@app.route('/api/admin/agents/<int:agent_id>', methods=['DELETE'])
def delete_agent(agent_id):
    # In a real app, this would require authentication
    global agents
    agent = next((a for a in agents if a['id'] == agent_id), None)
    if not agent:
        return jsonify({'message': 'Agent not found'}), 404
    
    agents = [a for a in agents if a['id'] != agent_id]
    return jsonify({'message': 'Agent deleted successfully'})

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
    return jsonify(new_builder), 201

@app.route('/api/admin/builders/<int:builder_id>', methods=['PUT'])
def update_builder(builder_id):
    # In a real app, this would require authentication
    builder = next((b for b in builders if b['id'] == builder_id), None)
    if not builder:
        return jsonify({'message': 'Builder not found'}), 404
    
    data = request.get_json()
    
    builder['name'] = data.get('name', builder['name'])
    builder['projects_count'] = data.get('projects_count', builder['projects_count'])
    builder['image'] = data.get('image', builder['image'])
    builder['description'] = data.get('description', builder['description'])
    
    return jsonify(builder)

@app.route('/api/admin/builders/<int:builder_id>', methods=['DELETE'])
def delete_builder(builder_id):
    # In a real app, this would require authentication
    global builders
    builder = next((b for b in builders if b['id'] == builder_id), None)
    if not builder:
        return jsonify({'message': 'Builder not found'}), 404
    
    builders = [b for b in builders if b['id'] != builder_id]
    return jsonify({'message': 'Builder deleted successfully'})

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