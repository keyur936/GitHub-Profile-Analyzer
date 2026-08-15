import time
import threading

class SimpleCache:
    def __init__(self, default_ttl=300):
        self.default_ttl = default_ttl
        self._store = {}
        self._lock = threading.Lock()

    def get(self, key):
        with self._lock:
            item = self._store.get(key)
            if not item:
                return None
            if time.time() > item['expires_at']:
                del self._store[key]
                return None
            return item['data']

    def set(self, key, value, ttl=None):
        ttl = ttl if ttl is not None else self.default_ttl
        with self._lock:
            self._store[key] = {
                'data': value,
                'expires_at': time.time() + ttl
            }

    def clear(self):
        with self._lock:
            self._store.clear()

cache = SimpleCache(default_ttl=300)
