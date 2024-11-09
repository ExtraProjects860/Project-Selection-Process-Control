import time
from flask import Request, jsonify
from threading import Lock

class RateLimiter:
    def __init__(self, requests_limit: int, time_window: int):
        self.__requests_limit: int = requests_limit
        self.__time_window: int = time_window
        self.__request_counters: dict[str, int] = {}
        self.lock: Lock = Lock()

    def __call__(self, request: Request) -> bool:
        client_ip: str = request.remote_addr
        route_path: str = request.path

        current_time = int(time.time())
        key = f"{client_ip}:{route_path}"

        with self.lock:
            counter: int | dict[str, int] = self.__request_counters.get(key, {"timestamp": current_time, "count": 0})

            if current_time - counter["timestamp"] > self.__time_window:
                counter = {"timestamp": current_time, "count": 1}
            else:
                counter["count"] += 1
                if counter["count"] > self.__requests_limit:
                    return jsonify({"error": "Too Many Requests"}), 429

            self.__request_counters[key] = counter

            keys_to_delete: list[str] = [k for k, v in self.__request_counters.items() if current_time - v["timestamp"] > self.__time_window]
            for k in keys_to_delete:
                del self.__request_counters[k]

        return True