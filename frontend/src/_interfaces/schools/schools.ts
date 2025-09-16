export interface School {
  _id: string;
  school_name: string;
  county: string;
  country: string;
  created_at: string;
  updated_at: string;
}

export interface SchoolCreateRequest {
  school_name: string;
  county: string;
  country: string;
}

export interface BulkSchoolsCreateRequest {
  schools: SchoolCreateRequest[];
}

// List of counties in the Republic of Ireland
export const IRISH_COUNTIES = [
    'Dublin',
    'Cork',
    'Galway',
    'Limerick',
    'Waterford',
    'Carlow',
    'Cavan',
    'Clare',
    'Donegal',
    'Kerry',
    'Kildare',
    'Kilkenny',
    'Laois',
    'Leitrim',
    'Longford',
    'Louth',
    'Mayo',
    'Meath',
    'Monaghan',
    'Offaly',
    'Roscommon',
    'Sligo',
    'Tipperary',
    'Westmeath',
    'Wexford',
    'Wicklow'
].sort();