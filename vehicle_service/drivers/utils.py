import math

def calculate_distance(lat1, lon1, lat2, lon2):
    return math.sqrt((lat1 - lat2)**2 + (lon1 - lon2)**2)


def get_nearby_drivers(user_lat, user_lon, drivers, radius=5):

    nearby = []

    for driver in drivers:

        distance = calculate_distance(
            user_lat, user_lon,
            driver.latitude, driver.longitude
        )

        if distance <= radius and driver.is_available:
            nearby.append(driver)

    return nearby