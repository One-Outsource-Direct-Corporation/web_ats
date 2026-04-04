import { useUsers } from "@/features/prf/hooks/useUsers";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { formatDepartmentName } from "@/shared/utils/formatDepartmentName";
import formatName from "@/shared/utils/formatName";
import { Trash2, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { User } from "@/features/auth/types/auth.types";

interface HumanResourcesProps {
  interviewer: User | null;
  handleInterviewerSelection: (interviewer: User | null) => void;
}

const ALLOWED_INTERVIEWER_ROLES = [
  "manager",
  "supervisor",
  "human_resources",
  "human_resources_manager",
  "finance_manager",
  "general_manager",
];

export function HumanResourcesMember({
  interviewer,
  handleInterviewerSelection,
}: HumanResourcesProps) {
  const [showInterviewerList, setShowInterviewerList] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { users } = useUsers({});

  const handleToggleInterviewerList = () => {
    setShowInterviewerList((prev) => !prev);
  };

  console.log(users);

  const filteredUsers = users.filter((user) =>
    ALLOWED_INTERVIEWER_ROLES.includes(user.role),
  );

  console.log(filteredUsers);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">Interviewer</label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700"
          onClick={handleToggleInterviewerList}
        >
          View Interviewer List{" "}
          {showInterviewerList ? (
            <ChevronUp className="h-4 w-4 ml-1" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-1" />
          )}
        </Button>
      </div>

      <Input
        placeholder="Search interviewer name"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="mb-3"
      />

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interviewer === null ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-gray-500 py-8"
                >
                  No interviewer selected
                </TableCell>
              </TableRow>
            ) : (
              <TableRow key={interviewer.id}>
                <TableCell>{`${interviewer.first_name} ${interviewer.last_name}`}</TableCell>
                <TableCell>{formatName(interviewer.role)}</TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600"
                    onClick={() => handleInterviewerSelection(null)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showInterviewerList && (
        <div className="mt-3 border rounded-lg overflow-hidden bg-blue-50">
          <div className="bg-blue-600 text-white p-3">
            <h4 className="font-semibold">Interviewer Selection</h4>
            <p className="text-xs text-blue-100 mt-1">
              Select one interviewer for this pipeline step.
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-100">
                <TableHead className="text-blue-900">Names</TableHead>
                <TableHead className="text-blue-900">Position</TableHead>
                <TableHead className="text-blue-900">Department</TableHead>
                <TableHead className="text-blue-900">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const isSelected = interviewer?.id === user.id;
                return (
                  <TableRow
                    key={user.id}
                    className={isSelected ? "bg-blue-50" : "bg-white"}
                  >
                    <TableCell className="text-blue-600 underline cursor-pointer">
                      {`${user.first_name} ${user.last_name}`}
                    </TableCell>
                    <TableCell>{formatName(user.role)}</TableCell>
                    <TableCell>
                      {formatDepartmentName(user.department.name)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-between">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 ${
                            isSelected
                              ? "text-red-600 hover:text-red-700"
                              : "text-blue-600 hover:text-blue-700"
                          }`}
                          onClick={() =>
                            handleInterviewerSelection(isSelected ? null : user)
                          }
                        >
                          {isSelected ? (
                            <Trash2 className="h-4 w-4" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
