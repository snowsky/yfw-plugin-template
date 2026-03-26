"""
Example Pydantic schemas — replace with your domain models.
"""
from pydantic import BaseModel


class HelloResponse(BaseModel):
    message: str
    user: str


class PluginInfoResponse(BaseModel):
    name: str
    version: str
    description: str
