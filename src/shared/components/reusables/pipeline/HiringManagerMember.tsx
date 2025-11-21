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
import { Trash2, Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { User } from "@/features/auth/types/auth.types";

interface HiringManagerMemberProps {
  hiringManagers: User[] | [];
  handleHiringManagerSelection: (manager: User) => void;
}

export function HiringManagerMember({
  hiringManagers,
  handleHiringManagerSelection,
}: HiringManagerMemberProps) {
  const [showViewHiringManager, setShowViewHiringManager] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { users } = useUsers({ position: "hiring_manager" });

  const handleToggleViewHiringManager = () => {
    setShowViewHiringManager((prev) => !prev);
  };

  // Filter users by role and search value
  const filteredUsers = users
    .filter((user) => user.role === "hiring_manager")
    .filter((user) =>
      user.full_name.toLowerCase().includes(searchValue.toLowerCase())
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">
          Hiring Manager
        </label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700"
          onClick={handleToggleViewHiringManager}
        >
          View Hiring Manager{" "}
          {showViewHiringManager ? (
            <ChevronUp className="h-4 w-4 ml-1" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-1" />
          )}
        </Button>
      </div>

      <Input
        placeholder="Search hiring manager name"
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
            {hiringManagers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-gray-500 py-8"
                >
                  No hiring manager selected
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers
                .filter((manager) =>
                  hiringManagers.some((hm) => hm.id === manager.id)
                )
                .map((manager) => (
                  <TableRow key={manager.id}>
                    <TableCell>{manager.full_name}</TableCell>
                    <TableCell>{formatName(manager.role)}</TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600"
                        onClick={() => handleHiringManagerSelection(manager)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Hiring Manager Expanded List */}
      {showViewHiringManager && (
        <div className="mt-3 border rounded-lg overflow-hidden bg-blue-50">
          <div className="bg-blue-600 text-white p-3">
            <h4 className="font-semibold">Pipeline Stages</h4>
            <p className="text-xs text-blue-100 mt-1">
              You can customize automated stage actions for this pipeline here.
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
              {filteredUsers.map((manager) => {
                const isSelected = hiringManagers.some(
                  (hm) => hm.id === manager.id
                );
                return (
                  <TableRow
                    key={manager.id}
                    className={isSelected ? "bg-blue-50" : "bg-white"}
                  >
                    <TableCell className="text-blue-600 underline cursor-pointer">
                      {manager.full_name}
                    </TableCell>
                    <TableCell>{formatName(manager.role)}</TableCell>
                    <TableCell>
                      {formatDepartmentName(manager.department)}
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
                          onClick={() => handleHiringManagerSelection(manager)}
                        >
                          {isSelected ? (
                            <X className="h-4 w-4" />
                          ) : (
                            <Plus className="h-4 w-4" />
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
