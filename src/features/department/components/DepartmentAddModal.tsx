import { useEffect, useState } from "react";
import { LoaderCircle, PlusCircle } from "lucide-react";
import { toast } from "react-toastify";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { departmentService } from "@/features/department/services/department.service";
import type { CreateDepartmentPayload } from "@/features/department/types/department.types";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/shared/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import {
  Description,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";

export default function DepartmentAddModal({
  onDepartmentAdded,
}: {
  onDepartmentAdded?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  const [departmentForm, setDepartmentForm] = useState<CreateDepartmentPayload>(
    {
      name: "",
    },
  );

  const axiosPrivate = useAxiosPrivate();

  const resetForm = () => {
    setDepartmentForm({ name: "" });
    setErrors({});
    setOpen(false);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!departmentForm.name.trim()) {
      newErrors.name = "Department name is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createDepartment = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await departmentService.createDepartment(departmentForm, {
        httpClient: axiosPrivate,
      });

      toast.success("Department created successfully!");
      resetForm();
      onDepartmentAdded?.();
    } catch {
      toast.error("Failed to create department.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setErrors({});
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-blue-500 hover:text-blue-500">
          <PlusCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Department</DialogTitle>
          <Description className="text-sm text-muted-foreground">
            Add a new department for job posting workflows.
          </Description>
        </DialogHeader>

        <FieldGroup>
          <Field>
            <FieldLabel>Department Name *</FieldLabel>
            <Input
              value={departmentForm.name}
              onChange={(event) =>
                setDepartmentForm((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
              placeholder="Enter department name"
            />
            {errors.name && <FieldError>{errors.name}</FieldError>}
          </Field>
        </FieldGroup>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            type="button"
            onClick={resetForm}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="button" onClick={createDepartment} disabled={loading}>
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Saving..." : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
