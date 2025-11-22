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

interface HumanResourcesProps {
  humanResources: User[] | [];
  handleHumanResourcesSelection: (manager: User) => void;
}

export function HumanResourcesMember({
  humanResources,
  handleHumanResourcesSelection,
}: HumanResourcesProps) {
  const [showViewHumanResources, setShowViewHumanResources] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const { users } = useUsers({ position: "human_resources" });

  const handleToggleViewHumanResources = () => {
    setShowViewHumanResources((prev) => !prev);
  };

  // Filter users by role and search value
  const filteredUsers = users
    .filter((user) => user.role === "human_resources")
    .filter((user) =>
      user.full_name.toLowerCase().includes(searchValue.toLowerCase())
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">
          Human Resources
        </label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700"
          onClick={handleToggleViewHumanResources}
        >
          View Human Resources{" "}
          {showViewHumanResources ? (
            <ChevronUp className="h-4 w-4 ml-1" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-1" />
          )}
        </Button>
      </div>

      <Input
        placeholder="Search human resources name"
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
            {humanResources.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-gray-500 py-8"
                >
                  No human resources selected
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers
                .filter((manager) =>
                  humanResources.some((hm) => hm.id === manager.id)
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
                        onClick={() => handleHumanResourcesSelection(manager)}
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

      {/* View Human Resources Expanded List */}
      {showViewHumanResources && (
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
                const isSelected = humanResources.some(
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
                          onClick={() => handleHumanResourcesSelection(manager)}
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
