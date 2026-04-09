
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class Company(Base):
    __tablename__ = "companies"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)

    vehicles = relationship("Vehicle", back_populates="company")
    users = relationship("User", back_populates="company")


class Vehicle(Base):
    __tablename__ = "vehicles"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    lat = Column(Float)
    lng = Column(Float)

    company_id = Column(Integer, ForeignKey("companies.id"))
    company = relationship("Company", back_populates="vehicles")


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

    role = Column(String)  # "admin" | "driver"
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=True)

    company_id = Column(Integer, ForeignKey("companies.id"))
    company = relationship("Company", back_populates="users")