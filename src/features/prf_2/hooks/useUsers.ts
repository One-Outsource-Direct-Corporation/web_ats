import { useQuery } from "@tanstack/react-query";
import type { User } from "@/features/auth/types/auth.types";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { usersDev } from "@/features/prf_2/data/users-dev";
import { prfUserService } from "@/features/prf_2/services/PRFUserService";
import { queryKeys } from "@/shared/query-keys";

export const useUsersByDepartment = ({
  business_unit,
  department,
  email,
  include,
}: {
  business_unit: string;
  department: number;
  email?: string;
  include?: string;
}) => {
  const axiosPrivate = useAxiosPrivate();

  const query = useQuery({
    queryKey: queryKeys.prf.usersByDepartment({
      businessUnit: business_unit,
      department,
      email,
      include,
    }),
    queryFn: () => {
      if (import.meta.env.VITE_REACT_ENV === "development") {
        return Promise.resolve(usersDev());
      }

      return prfUserService.getUsersByDepartmentResponse(
        {
          business_unit,
          department,
          email,
          include,
        },
        {
          httpClient: axiosPrivate,
        },
      );
    },
    enabled: Boolean(business_unit && department),
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

      return prfUserService.getUsersResponse(
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
