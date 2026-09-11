import urllib.request
import json
import os
import time

# Load environment variables from root .env
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
if os.path.exists(env_path):
    with open(env_path, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, val = line.split('=', 1)
                os.environ[key.strip()] = val.strip()

SUPABASE_URL = os.environ.get('SUPABASE_URL', '').rstrip('/')
SUPABASE_ANON_KEY = os.environ.get('SUPABASE_ANON_KEY', '')

class SupabaseBackendClient:
    def __init__(self):
        self.url = SUPABASE_URL
        self.key = SUPABASE_ANON_KEY
        self.is_configured = bool(
            self.url and self.key and 
            self.url != 'YOUR_SUPABASE_PROJECT_URL' and 
            self.key != 'YOUR_SUPABASE_ANON_KEY'
        )

    def _headers(self, auth_token=None):
        headers = {
            'apikey': self.key,
            'Content-Type': 'application/json'
        }
        if auth_token:
            headers['Authorization'] = f'Bearer {auth_token}'
        return headers

    def sign_up(self, email, password, full_name=''):
        """Registers a new user via Supabase Auth REST endpoint."""
        if not self.is_configured:
            # Fallback mock response for immediate preview
            user = {
                'id': f'user_{int(time.time())}',
                'email': email,
                'user_metadata': {'full_name': full_name or email.split('@')[0]}
            }
            return {'user': user, 'session': {'access_token': f'mock_token_{int(time.time())}', 'user': user}}, None

        endpoint = f"{self.url}/auth/v1/signup"
        payload = json.dumps({
            'email': email,
            'password': password,
            'data': {'full_name': full_name}
        }).encode('utf-8')

        req = urllib.request.Request(endpoint, data=payload, headers=self._headers(), method='POST')
        try:
            with urllib.request.urlopen(req, timeout=8) as response:
                res_data = json.loads(response.read().decode('utf-8'))
                return res_data, None
        except urllib.error.HTTPError as e:
            err_body = e.read().decode('utf-8')
            try:
                err_json = json.loads(err_body)
                return None, err_json.get('msg') or err_json.get('error_description') or str(e)
            except:
                return None, str(e)
        except Exception as ex:
            return None, str(ex)

    def sign_in(self, email, password):
        """Authenticates user with email and password via Supabase Auth REST endpoint."""
        if not self.is_configured:
            user = {
                'id': 'user_demo_123',
                'email': email,
                'user_metadata': {'full_name': email.split('@')[0].replace('.', ' ').title()}
            }
            return {'user': user, 'access_token': f'mock_token_{int(time.time())}'}, None

        endpoint = f"{self.url}/auth/v1/token?grant_type=password"
        payload = json.dumps({
            'email': email,
            'password': password
        }).encode('utf-8')

        req = urllib.request.Request(endpoint, data=payload, headers=self._headers(), method='POST')
        try:
            with urllib.request.urlopen(req, timeout=8) as response:
                res_data = json.loads(response.read().decode('utf-8'))
                return res_data, None
        except urllib.error.HTTPError as e:
            err_body = e.read().decode('utf-8')
            try:
                err_json = json.loads(err_body)
                return None, err_json.get('msg') or err_json.get('error_description') or str(e)
            except:
                return None, str(e)
        except Exception as ex:
            return None, str(ex)

    def sign_out(self, access_token):
        """Terminates session on Supabase."""
        if not self.is_configured or not access_token:
            return {'success': True}, None

        endpoint = f"{self.url}/auth/v1/logout"
        req = urllib.request.Request(endpoint, data=b'{}', headers=self._headers(access_token), method='POST')
        try:
            with urllib.request.urlopen(req, timeout=6) as response:
                return {'success': True}, None
        except Exception as ex:
            return {'success': True}, None

    def get_user(self, access_token):
        """Fetches the user details for a given access token."""
        if not self.is_configured or not access_token:
            if access_token and access_token.startswith('mock_token_'):
                return {
                    'id': 'user_demo_123',
                    'email': 'thabo.student@signvision.co.za',
                    'user_metadata': {'full_name': 'Thabo Mokoena'}
                }, None
            return None, "No token provided"

    def reset_password_for_email(self, email):
        """Sends password reset email/recovery via Supabase Auth REST endpoint."""
        if not self.is_configured:
            # Fallback mock response for demo preview
            return {'message': f'Password recovery instructions dispatched to {email}'}, None

        endpoint = f"{self.url}/auth/v1/recover"
        payload = json.dumps({'email': email}).encode('utf-8')
        req = urllib.request.Request(endpoint, data=payload, headers=self._headers(), method='POST')
        try:
            with urllib.request.urlopen(req, timeout=8) as response:
                res_data = json.loads(response.read().decode('utf-8'))
                return res_data, None
        except urllib.error.HTTPError as e:
            err_body = e.read().decode('utf-8')
            try:
                err_json = json.loads(err_body)
                return None, err_json.get('msg') or err_json.get('error_description') or str(e)
            except:
                return None, str(e)
        except Exception as ex:
            return None, str(ex)

