from flask import Flask, render_template, jsonify, request
import json
import requests

app = Flask(__name__)

# Route for the homepage
@app.route('/')
def index():
    return render_template('index.html')

# Route for fetching geolocation data
@app.route('/get_geo_data', methods=['POST'])
def get_geo_data():
    ip = request.form.get('ip')
    url = f'http://ip-api.com/json/{ip}'

    try:
        response = requests.get(url)
        data = response.json()

        if data['status'] == 'fail':
            return jsonify({'error': 'Invalid or private IP address.'})
        
        geo_data = {
            'ip': data['query'],
            'country': data['country'],
            'region': data['regionName'],
            'city': data['city'],
            'latitude': data['lat'],
            'longitude': data['lon']
        }

        # Storing the result in a history file or database can be added here
        return jsonify(geo_data)
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)

