from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import random

from database import SessionLocal, engine
from models import Base, Company, User, Vehicle
from auth import hash_password, verify_password
from utils import calculate_eta

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Navix API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- DB ----------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------- REGISTER COMPANY ----------------
@app.get("/register_company")
def register_company(email: str, password: str, company: str, db: Session = Depends(get_db)):
    if db.query(User).filter_by(email=email).first():
        raise HTTPException(400, "User already exists")

    comp = Company(name=company)
    db.add(comp)
    db.commit()
    db.refresh(comp)

    admin = User(
        email=email,
        password=hash_password(password),
        role="admin",
        company_id=comp.id
    )
    db.add(admin)
    db.commit()

    return {"status": "company_created"}

# ---------------- LOGIN ----------------
@app.get("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(email=email).first()

    if not user or not verify_password(password, user.password):
        raise HTTPException(401, "Invalid credentials")

    return {
        "email": user.email,
        "role": user.role,
        "company": user.company.name,
        "vehicle": user.vehicle_id
    }

# ---------------- ADD VEHICLE ----------------
@app.get("/add_vehicle")
def add_vehicle(name: str, company: str, db: Session = Depends(get_db)):
    comp = db.query(Company).filter_by(name=company).first()

    if not comp:
        raise HTTPException(404, "Company not found")

    v = Vehicle(
        name=name,
        lat=17.385 + random.uniform(-0.02, 0.02),
        lng=78.4867 + random.uniform(-0.02, 0.02),
        company_id=comp.id
    )

    db.add(v)
    db.commit()

    return {"status": "vehicle_added"}

# ---------------- CREATE DRIVER ----------------
@app.get("/create_driver")
def create_driver(email: str, password: str, vehicle_name: str, company: str, db: Session = Depends(get_db)):
    comp = db.query(Company).filter_by(name=company).first()
    vehicle = db.query(Vehicle).filter_by(name=vehicle_name).first()

    if not comp or not vehicle:
        raise HTTPException(404, "Company or Vehicle not found")

    driver = User(
        email=email,
        password=hash_password(password),
        role="driver",
        vehicle_id=vehicle.id,
        company_id=comp.id
    )

    db.add(driver)
    db.commit()

    return {"status": "driver_created"}

# ---------------- GPS ----------------
@app.get("/gps_secure")
def gps_secure(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(email=email).first()

    if not user:
        raise HTTPException(404, "User not found")

    vehicles = (
        user.company.vehicles
        if user.role == "admin"
        else [db.query(Vehicle).get(user.vehicle_id)]
    )

    result = []

    for v in vehicles:
        v.lat += random.uniform(0.0003, 0.0007)
        v.lng += random.uniform(0.0003, 0.0007)

        result.append({
            "id": v.name,
            "lat": v.lat,
            "lng": v.lng
        })

    db.commit()
    return result

# ---------------- DRIVERS LIST ----------------
@app.get("/drivers/{company}")
def get_drivers(company: str, db: Session = Depends(get_db)):
    comp = db.query(Company).filter_by(name=company).first()

    if not comp:
        raise HTTPException(404, "Company not found")

    return [
        {
            "email": u.email,
            "vehicle_id": u.vehicle_id
        }
        for u in comp.users if u.role == "driver"
    ]

# ---------------- ETA ----------------
@app.get("/eta/{vehicle}")
def eta(vehicle: str, db: Session = Depends(get_db)):
    v = db.query(Vehicle).filter_by(name=vehicle).first()

    if not v:
        raise HTTPException(404, "Vehicle not found")

    return {"eta_minutes": calculate_eta(v.lat, v.lng)}

@app.get("/gps/{company}")
def gps_legacy(company: str, db: Session = Depends(get_db)):
    comp = db.query(Company).filter_by(name=company).first()

    if not comp:
        raise HTTPException(404, "Company not found")

    result = []

    for v in comp.vehicles:
        result.append({
            "id": v.name,
            "lat": v.lat,
            "lng": v.lng
        })

    return result