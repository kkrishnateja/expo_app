from pydantic import BaseModel
from datetime import datetime

class Transaction(BaseModel):
    name: str
    datetime: datetime
    description: str
    price: float