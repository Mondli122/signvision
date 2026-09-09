import urllib.request
import json
import os
import time

# Load environment variables from .env if present
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
if os.path.exists(env_path):
    with open(env_path, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, val = line.split('=', 1)
                os.environ[key.strip()] = val.strip()

OPENROUTER_API_KEY = os.environ.get('OPENROUTER_API_KEY')
PRIMARY_MODEL = os.environ.get('OPENROUTER_PRIMARY_MODEL', 'google/gemma-4-31b-it:free')


FREE_MODELS = [
    PRIMARY_MODEL,
    'google/gemma-4-31b-it:free',
    'nex-agi/nex-n2.5-pro:free',
    'liquid/lfm-2.5-2.6b:free',
    'nvidia/nemotron-3.5-lightning:free',
    'openrouter/auto'
]

class OpenRouterClient:
    def __init__(self, api_key=None):
        self.api_key = api_key or OPENROUTER_API_KEY
        self.url = 'https://openrouter.ai/api/v1/chat/completions'

    def generate(self, system_prompt, user_prompt, max_tokens=300, temperature=0.7):
        """
        Sends a request to OpenRouter using free models chain.
        Returns generated text or None if all models fail/rate-limited.
        """
        if not self.api_key:
            return None

        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://signvision.app',
            'X-Title': 'SignVision SA'
        }

        # Deduplicate models
        candidate_models = list(dict.fromkeys(FREE_MODELS))

        for model in candidate_models:
            payload = {
                'model': model,
                'messages': [
                    {'role': 'system', 'content': system_prompt},
                    {'role': 'user', 'content': user_prompt}
                ],
                'max_tokens': max_tokens,
                'temperature': temperature
            }

            try:
                req = urllib.request.Request(
                    self.url,
                    data=json.dumps(payload).encode('utf-8'),
                    headers=headers,
                    method='POST'
                )
                with urllib.request.urlopen(req, timeout=10) as response:
                    res_data = json.loads(response.read().decode('utf-8'))
                    if 'choices' in res_data and len(res_data['choices']) > 0:
                        content = res_data['choices'][0]['message']['content'].strip()
                        if content:
                            return content
            except urllib.error.HTTPError as e:
                # Rate limit (429) or Not Found (404) -> try next model
                continue
            except Exception as e:
                continue

        return None
