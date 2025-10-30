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
import { Trash2, Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import { TEAM_MEMBERS } from "./constants";

interface TeamMemberSectionProps {
  selectedTeamMembers: number[];
  onToggleTeamMember: (memberId: number) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  showViewTeamMember: boolean;
  onToggleViewTeamMember: () => void;
}

export function TeamMemberSection({
  selectedTeamMembers,
  onToggleTeamMember,
  searchValue,
  onSearchChange,
  showViewTeamMember,
  onToggleViewTeamMember,
}: TeamMemberSectionProps) {
  const filteredTeamMembers = TEAM_MEMBERS.filter((member) =>
    member.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">Team Member</label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700"
          onClick={onToggleViewTeamMember}
        >
          View Team Member{" "}
          {showViewTeamMember ? (
            <ChevronUp className="h-4 w-4 ml-1" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-1" />
          )}
        </Button>
      </div>

      <Input
        placeholder="Search team members..."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
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
            {selectedTeamMembers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-gray-500 py-8"
                >
                  No team members selected
                </TableCell>
              </TableRow>
            ) : (
              filteredTeamMembers
                .filter((member) => selectedTeamMembers.includes(member.id))
                .map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.position}</TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600"
                        onClick={() => onToggleTeamMember(member.id)}
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

      {/* View Team Member Expanded List */}
      {showViewTeamMember && (
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
                <TableHead className="text-blue-900">Process</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeamMembers.map((member) => {
                const isSelected = selectedTeamMembers.includes(member.id);
                return (
                  <TableRow
                    key={member.id}
                    className={isSelected ? "bg-blue-50" : "bg-white"}
                  >
                    <TableCell className="text-blue-600 underline cursor-pointer">
                      {member.name}
                    </TableCell>
                    <TableCell>{member.position}</TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-between">
                        <span>{member.process}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 ${
                            isSelected
                              ? "text-red-600 hover:text-red-700"
                              : "text-blue-600 hover:text-blue-700"
                          }`}
                          onClick={() => onToggleTeamMember(member.id)}
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
