from datetime import date, datetime


# =========================================================
# BLOOD UNIT DATABASE
# =========================================================

blood_units = [
    {
        "serial_number": "SN-BNEG-001",
        "blood_group": "B-",
        "donation_date": "2026-08-01",
        "expiry_date": "2026-08-15",
        "status": "Available",
    },
    {
        "serial_number": "SN-BNEG-002",
        "blood_group": "B-",
        "donation_date": "2026-08-02",
        "expiry_date": "2026-09-10",
        "status": "Available",
    },
    {
        "serial_number": "SN-BPOS-001",
        "blood_group": "B+",
        "donation_date": "2026-08-03",
        "expiry_date": "2026-09-15",
        "status": "Available",
    },
    {
        "serial_number": "SN-OPOS-001",
        "blood_group": "O+",
        "donation_date": "2026-08-03",
        "expiry_date": "2026-09-14",
        "status": "Available",
    },
    {
        "serial_number": "SN-ONEG-001",
        "blood_group": "O-",
        "donation_date": "2026-08-04",
        "expiry_date": "2026-08-20",
        "status": "Available",
    },
    {
        "serial_number": "SN-APOS-001",
        "blood_group": "A+",
        "donation_date": "2026-08-04",
        "expiry_date": "2026-09-18",
        "status": "Available",
    },
]


# =========================================================
# EMERGENCY REQUESTS
# =========================================================

emergency_requests = []


# =========================================================
# DONOR APPOINTMENTS
# =========================================================

donor_appointments = [
    {
        "name": "Rahul Sharma",
        "blood_group": "B+",
        "time": "10:00 AM",
        "type": "Hospital Donation",
        "date": "2026-08-08",
    },
    {
        "name": "Priya Das",
        "blood_group": "O+",
        "time": "11:30 AM",
        "type": "Hospital Donation",
        "date": "2026-08-08",
    },
]


# =========================================================
# BUILD INVENTORY FROM INDIVIDUAL BLOOD UNITS
# =========================================================

def build_inventory():

    groups = [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
    ]

    inventory = []

    today = date.today()

    for group in groups:

        units = [
            unit
            for unit in blood_units
            if unit["blood_group"] == group
            and unit["status"] == "Available"
        ]

        available = len(units)

        expiring = 0

        for unit in units:

            try:
                expiry = datetime.strptime(
                    unit["expiry_date"],
                    "%Y-%m-%d"
                ).date()

                days_remaining = (
                    expiry - today
                ).days

                if 0 <= days_remaining <= 30:
                    expiring += 1

            except ValueError:
                pass

        inventory.append(
            {
                "blood_group": group,
                "available": available,
                "expiring": expiring,
            }
        )

    return inventory