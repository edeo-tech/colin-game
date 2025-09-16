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