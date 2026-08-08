from datetime import date, datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from data import (
    blood_units,
    emergency_requests,
    donor_appointments,
    build_inventory,
)

# =========================================================
# GEMINI
# =========================================================

try:
    from gemini import generate_recommendation
    GEMINI_AVAILABLE = True
except Exception:
    GEMINI_AVAILABLE = False


# =========================================================
# APP
# =========================================================

app = FastAPI(
    title="Sanjeevani Backend",
    description="Blood & Plasma Supply Coordination API",
    version="1.0.0",
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/")
def root():

    return {
        "status": "online",
        "service": "Sanjeevani Backend",
        "message": "Blood supply coordination API is running",
    }


# =========================================================
# INVENTORY
# =========================================================

@app.get("/inventory")
def get_inventory():

    inventory = build_inventory()

    return {
        "success": True,
        "inventory": inventory,
    }


# =========================================================
# BLOOD UNITS
# =========================================================

@app.get("/blood-units")
def get_blood_units():

    return {
        "success": True,
        "units": blood_units,
    }


# =========================================================
# REGISTER BLOOD UNIT
# =========================================================

@app.post("/blood-unit")
def register_blood_unit(request: dict):

    serial_number = str(
        request.get("serial_number", "")
    ).strip()

    blood_group = str(
        request.get("blood_group", "")
    ).strip()

    donation_date = str(
        request.get("donation_date", "")
    ).strip()

    expiry_date = str(
        request.get("expiry_date", "")
    ).strip()

    # ---------------------------------------------
    # REQUIRED FIELD VALIDATION
    # ---------------------------------------------

    if not serial_number:
        return {
            "success": False,
            "message": "Serial number is required",
        }

    if not blood_group:
        return {
            "success": False,
            "message": "Blood group is required",
        }

    if not donation_date:
        return {
            "success": False,
            "message": "Donation date is required",
        }

    if not expiry_date:
        return {
            "success": False,
            "message": "Expiry date is required",
        }

    # ---------------------------------------------
    # BLOOD GROUP VALIDATION
    # ---------------------------------------------

    valid_groups = [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
    ]

    if blood_group not in valid_groups:

        return {
            "success": False,
            "message": "Invalid blood group",
        }

    # ---------------------------------------------
    # DUPLICATE SERIAL NUMBER
    # ---------------------------------------------

    for unit in blood_units:

        if unit["serial_number"] == serial_number:

            return {
                "success": False,
                "message": "Serial number already exists",
            }

    # ---------------------------------------------
    # DATE VALIDATION
    # ---------------------------------------------

    try:

        donation = datetime.strptime(
            donation_date,
            "%Y-%m-%d",
        ).date()

        expiry = datetime.strptime(
            expiry_date,
            "%Y-%m-%d",
        ).date()

    except ValueError:

        return {
            "success": False,
            "message": "Date must use YYYY-MM-DD format",
        }

    if expiry <= donation:

        return {
            "success": False,
            "message": "Expiry date must be after donation date",
        }

    # ---------------------------------------------
    # EXPIRY VALIDATION
    # ---------------------------------------------

    if expiry < date.today():

        return {
            "success": False,
            "message": "Cannot register an already expired unit",
        }

    # ---------------------------------------------
    # CREATE UNIT
    # ---------------------------------------------

    unit = {
        "serial_number": serial_number,
        "blood_group": blood_group,
        "donation_date": donation_date,
        "expiry_date": expiry_date,
        "status": "Available",
    }

    blood_units.append(unit)

    return {
        "success": True,
        "message": "Blood unit registered successfully",
        "unit": unit,
    }


# =========================================================
# EMERGENCY REQUESTS
# =========================================================

@app.get("/emergency")
def get_emergency_requests():

    return {
        "success": True,
        "requests": emergency_requests,
    }


@app.post("/emergency")
def create_emergency_request(request: dict):

    blood_group = request.get(
        "blood_group",
        "",
    )

    units = request.get(
        "units",
        1,
    )

    hospital = request.get(
        "hospital",
        "Unknown Hospital",
    )

    priority = request.get(
        "priority",
        "Emergency",
    )

    new_request = {
        "id": len(emergency_requests) + 1,
        "hospital": hospital,
        "blood_group": blood_group,
        "units": units,
        "priority": priority,
        "status": "Pending",
    }

    emergency_requests.append(
        new_request
    )

    return {
        "success": True,
        "request": new_request,
    }


# =========================================================
# DONOR APPOINTMENTS
# =========================================================

@app.get("/donors")
def get_donors():

    return {
        "success": True,
        "appointments": donor_appointments,
    }


@app.post("/donor-booking")
def create_donor_booking(request: dict):

    appointment = {
        "name": request.get(
            "name",
            "Demo Donor",
        ),
        "blood_group": request.get(
            "blood_group",
            "Unknown",
        ),
        "time": request.get(
            "time",
            "Not specified",
        ),
        "type": request.get(
            "type",
            "Hospital Donation",
        ),
        "date": request.get(
            "date",
            "",
        ),
    }

    donor_appointments.append(
        appointment
    )

    return {
        "success": True,
        "appointment": appointment,
    }


# =========================================================
# HIGH ALERT
# =========================================================

@app.get("/high-alert")
def get_high_alert():

    inventory = build_inventory()

    alerts = [
        item
        for item in inventory
        if item["expiring"] > 0
    ]

    return {
        "success": True,
        "alerts": alerts,
    }


# =========================================================
# AI RECOMMENDATION
# =========================================================

@app.get("/ai-recommendation")
def ai_recommendation():

    inventory = build_inventory()

    if not GEMINI_AVAILABLE:

        return {
            "success": False,
            "recommendation": {
                "priority": "LOW",
                "blood_group": "",
                "recommended_units": 0,
                "reason": "Gemini service is not available.",
                "recommended_action": "Review inventory manually.",
                "confidence": "LOW",
            },
        }

    try:

        result = generate_recommendation(
            inventory,
            emergency_requests,
        )

        return {
            "success": True,
            "recommendation": result,
        }

    except Exception as error:

        return {
            "success": False,
            "recommendation": {
                "priority": "LOW",
                "blood_group": "",
                "recommended_units": 0,
                "reason": "AI recommendation could not be generated.",
                "recommended_action": "Review inventory manually.",
                "confidence": "LOW",
            },
            "error": str(error),
        }