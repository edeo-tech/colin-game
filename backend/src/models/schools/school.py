from typing import Optional
from models._base import MongoBaseModel


class School(MongoBaseModel):
    school_name: str
    county: str
    country: str