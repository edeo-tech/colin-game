import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllSchools, getSchoolById, countSchools, createSchool } from '@/_api/schools/schools';
import { SchoolCreateRequest } from '@/_interfaces/schools/schools';

// Query to get all schools
export const useGetAllSchools = (params?: {
  county?: string;
  country?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ['schools', params],
    queryFn: () => getAllSchools(params),
  });
};

// Query to get a school by ID
export const useGetSchoolById = (schoolId: string) => {
  return useQuery({
    queryKey: ['school', schoolId],
    queryFn: () => getSchoolById(schoolId),
    enabled: !!schoolId,
  });
};

// Query to count schools
export const useCountSchools = (params?: {
  county?: string;
  country?: string;
}) => {
  return useQuery({
    queryKey: ['schools', 'count', params],
    queryFn: () => countSchools(params),
  });
};

// Mutation to create a new school
export const useCreateSchool = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (schoolData: SchoolCreateRequest) => createSchool(schoolData),
    onSuccess: () => {
      // Invalidate and refetch all school queries
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },
  });
};