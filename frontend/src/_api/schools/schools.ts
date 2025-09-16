import axios from '@/lib/axios';
import { School, SchoolCreateRequest, BulkSchoolsCreateRequest } from '@/_interfaces/schools/schools';

// Get all schools
export const getAllSchools = async (params?: {
  county?: string;
  country?: string;
  limit?: number;
}): Promise<School[]> => {
  const response = await axios.unprotectedApi.get('/app/schools/', { params });
  return response.data;
};

// Create a single school
export const createSchool = async (schoolData: SchoolCreateRequest): Promise<School> => {
  const response = await axios.protectedApi.post('/app/schools/', schoolData);
  return response.data;
};

// Create multiple schools
export const createSchoolsBulk = async (bulkData: BulkSchoolsCreateRequest): Promise<School[]> => {
  const response = await axios.protectedApi.post('/app/schools/bulk', bulkData);
  return response.data;
};

// Get a school by ID
export const getSchoolById = async (schoolId: string): Promise<School> => {
  const response = await axios.protectedApi.get(`/app/schools/${schoolId}`);
  return response.data;
};

// Count schools
export const countSchools = async (params?: {
  county?: string;
  country?: string;
}): Promise<number> => {
  const response = await axios.protectedApi.get('/app/schools/count', { params });
  return response.data;
};