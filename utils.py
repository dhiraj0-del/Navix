import math
from datetime import datetime

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * \
        math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


def traffic_factor():
    hour = datetime.now().hour
    if 8 <= hour <= 10 or 17 <= hour <= 19:
        return 0.6
    if 22 <= hour or hour <= 5:
        return 1.2
    return 0.9


def calculate_eta(lat, lng, dest_lat=17.385, dest_lng=78.4867):
    distance = haversine(lat, lng, dest_lat, dest_lng)
    speed = 40 * traffic_factor()
    return round((distance / speed) * 60)