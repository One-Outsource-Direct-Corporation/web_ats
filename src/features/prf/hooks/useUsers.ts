import { useQuery } from "@tanstack/react-query";
import type { User } from "@/features/auth/types/auth.types";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { usersDev } from "../data/users-dev";
import { prfService } from "@/features/prf/services/prf.service";
import { queryKeys } from "@/shared/query-keys";

export const useUsersByDepartment = ({
  business_unit,
  department_name,
  email,
  include,
}: {
  business_unit: string;
  department_name: string;
  email?: string;
  include?: string;
}) => {
  const axiosPrivate = useAxiosPrivate();

  const query = useQuery({
    queryKey: queryKeys.prf.usersByDepartment({
      businessUnit: business_unit,
      departmentName: department_name,
      email,
      include,
    }),
    queryFn: () => {
      if (import.meta.env.VITE_REACT_ENV === "development") {
        return Promise.resolve(usersDev());
      }

      return prfService.getUsersByDepartmentResponse(
        {
          business_unit,
          department_name,
          email,
          include,
        },
        {
          httpClient: axiosPrivate,
        },
      );
    },
    enabled: Boolean(business_unit && department_name),
  });

  return {
    users: (query.data as User[] | undefined) ?? [],
    loading: query.isLoading,
    error: query.error ? "Failed to fetch users" : null,
    refetch: query.refetch,
  };
};

export const useUsers = ({ position = "" }: { position?: string }) => {
  const axiosPrivate = useAxiosPrivate();

  const query = useQuery({
    queryKey: queryKeys.prf.users(position),
    queryFn: () => {
      if (import.meta.env.VITE_REACT_ENV === "development") {
        return Promise.resolve(
          usersDev().filter((user) =>
            position ? user.role === position : true,
          ),
        );
      }

      return prfService.getUsersResponse(
        { position },
        {
          httpClient: axiosPrivate,
        },
      );
    },
  });

  return {
    users: (query.data as User[] | undefined) ?? [],
    loading: query.isLoading,
    error: query.error ? "Failed to fetch users" : null,
    refetch: query.refetch,
  };
};
