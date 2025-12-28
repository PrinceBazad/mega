"""
Mock backend API for admin home content management.
This file shows how the backend should be updated to handle the new sections.
"""
from flask import Flask, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
import os

# Mock data storage (in a real application, this would be a database)
HOME_CONTENT_FILE = 'home_content.json'

def get_home_content():
    """Get the current home content from storage"""
    if os.path.exists(HOME_CONTENT_FILE):
        with open(HOME_CONTENT_FILE, 'r') as f:
            return json.load(f)
    else:
        # Default content
        default_content = {
            "hero": {
                "title": "Find Your Dream Property",
                "subtitle": "Discover the perfect place to call home with MegaReality",
                "backgroundImage": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
            },
            "about": {
                "title": "About MegaReality",
                "description": "We are a leading real estate company dedicated to helping you find your perfect property. With years of experience and a commitment to excellence, we make your property dreams come true.",
                "image": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
            },
            "contact": {
                "phone": "+91 98765 43210",
                "email": "info@megareality.com",
                "address": "123 Real Estate Avenue, Gurugram, Haryana 122001"
            },
            "properties": {
                "title": "Featured Properties",
                "description": "Discover our handpicked selection of premium properties"
            },
            "agents": {
                "title": "Our Expert Agents",
                "description": "Meet our team of experienced real estate professionals"
            },
            "services": {
                "title": "Our Services",
                "description": "Comprehensive real estate solutions tailored to your needs"
            },
            "autoscroll": {
                "title": "Auto-Scroll Section",
                "description": "Dynamic content that auto-scrolls to showcase our offerings",
                "pages": [
                    {
                        "backgroundImage": "https://images.unsplash.com/photo-1560448204-e02f33c33ddc?w=1920&q=80",
                        "title": "Premium Properties",
                        "description": "Discover our collection of premium properties in the best locations"
                    },
                    {
                        "backgroundImage": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1920&q=80",
                        "title": "Luxury Living",
                        "description": "Experience luxury living with our exclusive property collection"
                    },
                    {
                        "backgroundImage": "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1920&q=80",
                        "title": "Modern Designs",
                        "description": "Modern architectural designs for contemporary living"
                    },
                    {
                        "backgroundImage": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&q=80",
                        "title": "Affordable Options",
                        "description": "Find affordable options without compromising on quality"
                    },
                    {
                        "backgroundImage": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80",
                        "title": "Investment Opportunities",
                        "description": "Great investment opportunities with high returns"
                    }
                ]
            }
        }
        save_home_content(default_content)
        return default_content

def save_home_content(content):
    """Save the home content to storage"""
    with open(HOME_CONTENT_FILE, 'w') as f:
        json.dump(content, f, indent=2)

# Flask app routes
def register_home_content_routes(app):
    @app.route('/api/admin/home-content', methods=['GET'])
    @jwt_required()
    def get_home_content_route():
        """Get all home content"""
        try:
            content = get_home_content()
            return jsonify(content), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/api/admin/home-content/<section>', methods=['PUT'])
    @jwt_required()
    def update_home_content_section(section):
        """Update a specific section of home content"""
        try:
            content = get_home_content()
            
            # Validate section
            valid_sections = ['hero', 'about', 'contact', 'properties', 'agents', 'services', 'autoscroll']
            if section not in valid_sections:
                return jsonify({"error": f"Invalid section: {section}"}), 400
            
            # Update the section with new data
            new_data = request.get_json()
            if section in content:
                content[section].update(new_data)
            else:
                content[section] = new_data
            
            save_home_content(content)
            
            # In a real application, you would emit a WebSocket event or use a pub/sub system
            # to notify all connected clients about the update
            # For now, we'll just return success
            return jsonify({"message": f"{section} section updated successfully"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/api/admin/home-content', methods=['PUT'])
    @jwt_required()
    def update_all_home_content():
        """Update all home content at once"""
        try:
            new_content = request.get_json()
            save_home_content(new_content)
            return jsonify({"message": "Home content updated successfully"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500