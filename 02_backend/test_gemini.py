from gemini import generate_recommendation
from data import inventory, emergency_requests


result = generate_recommendation(
    inventory,
    emergency_requests
)

print(result)