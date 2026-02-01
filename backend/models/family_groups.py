from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database.base import Base
from datetime import datetime


class FamilyGroup(Base):
    __tablename__ = "family_groups"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    creator = relationship("User", backref="created_family_groups", foreign_keys=[created_by])
    members = relationship("FamilyGroupMember", backref="family_group", cascade="all, delete-orphan")


class FamilyGroupMember(Base):
    __tablename__ = "family_group_members"

    id = Column(Integer, primary_key=True, autoincrement=True)
    family_group_id = Column(Integer, ForeignKey("family_groups.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String(50), default="member")
    joined_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", backref="family_memberships")
