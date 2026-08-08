import os
import json

from dotenv import load_dotenv
from google import genai


# --------------------------------------------------
# LOAD ENVIRONMENT VARIABLES
# --------------------------------------------------

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")


if not API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is missing from .env"
    )


# --------------------------------------------------
# GEMINI CLIENT
# --------------------------------------------------

client = genai.Client(
    api_key=API_KEY
)


# --------------------------------------------------
# AI INVENTORY RECOMMENDATION
# --------------------------------------------------

def generate_recommendation(
    inventory,
    emergency_requests
):

    prompt = f"""
You are SANJEEVANI AI, an inventory coordination
assistant for a blood supply network.

Your job is to analyze blood inventory and emergency
requirements and recommend which inventory should be
prioritized.

IMPORTANT RULES:

1. Never sell or trade blood.
2. Never make a clinical decision.
3. Do not diagnose patients.
4. Only provide an operational recommendation.
5. Prioritize blood that is approaching expiry when
   there is a compatible legitimate requirement.
6. Consider available quantity.
7. Consider emergency priority.
8. Do not recommend transferring more units than are
   available.
9. Clearly explain the reasoning.
10. A licensed hospital must approve any transfer.

CURRENT INVENTORY:

{json.dumps(inventory, indent=2)}

CURRENT EMERGENCY REQUESTS:

{json.dumps(emergency_requests, indent=2)}


Return ONLY valid JSON in this exact structure:

{{
    "priority": "HIGH | MEDIUM | LOW",
    "blood_group": "string",
    "recommended_units": 0,
    "reason": "short explanation",
    "recommended_action": "short operational action",
    "confidence": "HIGH | MEDIUM | LOW"
}}
"""

    try:

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        text = response.text.strip()

        # Remove markdown code fences if Gemini adds them
        if text.startswith("```"):
            text = text.replace("```json", "")
            text = text.replace("```", "")
            text = text.strip()

        return json.loads(text)

    except Exception as error:

        return {
            "priority": "LOW",
            "blood_group": "",
            "recommended_units": 0,
            "reason": "AI recommendation could not be generated.",
            "recommended_action": "Review inventory manually.",
            "confidence": "LOW",
            "error": str(error)
        }