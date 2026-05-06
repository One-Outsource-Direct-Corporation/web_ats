import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LoaderCircle, PlusCircle, PlusIcon } from "lucide-react";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { validateEmail } from "@/shared/utils/validators";
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
import type { ClientBase } from "@/features/client/types/client.types";

export default function ClientAddModal({
  onClientAdded,
}: {
  onClientAdded?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  const [clientForm, setClientForm] = useState<ClientBase>({
    name: "",
    email: "",
    contact_number: "",
  });

  const axiosPrivate = useAxiosPrivate();

  const resetForm = () => {
    setClientForm({
      name: "",
      email: "",
      contact_number: "",
    });
    setErrors({});
    setOpen(false);
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    setClientForm({
      name: "",
      email: "",
      contact_number: "",
    });
    setErrors({});
  }, [open]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrors({});
    const formErrors: Record<string, string> = {};

    if (!clientForm.name.trim()) {
      formErrors.name = "Client name is required";
    }

    if (!validateEmail(clientForm.email)) {
      formErrors.email = "Client email is invalid";
    }

    if (!clientForm.contact_number.trim()) {
      formErrors.contact_number = "Contact number is required";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await axiosPrivate.post("api/client/", clientForm);

      if (response.status === 201) {
        resetForm();
        toast.success("Client added successfully");
        onClientAdded?.();
      }
    } catch (error) {
      console.error("Error adding client:", error);
      toast.error("Failed to add client. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-blue-500 hover:text-blue-500">
          <PlusCircle />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <Description hidden>Add your new client</Description>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel>Client Name</FieldLabel>
              <Input
                type="text"
                name="name"
                placeholder="Enter client name"
                value={clientForm.name}
                onChange={(event) =>
                  setClientForm({ ...clientForm, name: event.target.value })
                }
              />
              {errors.name && <FieldError>{errors.name}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Client Email</FieldLabel>
              <Input
                type="email"
                name="email"
                placeholder="Enter client email"
                value={clientForm.email}
                onChange={(event) =>
                  setClientForm({ ...clientForm, email: event.target.value })
                }
              />
              {errors.email && <FieldError>{errors.email}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Contact Number</FieldLabel>
              <Input
                type="tel"
                name="contact_number"
                placeholder="Enter contact number"
                maxLength={11}
                value={clientForm.contact_number}
                onChange={(event) =>
                  setClientForm({
                    ...clientForm,
                    contact_number: event.target.value,
                  })
                }
              />
              {errors.contact_number && (
                <FieldError>{errors.contact_number}</FieldError>
              )}
            </Field>
          </FieldGroup>

          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 mt-4 w-full"
            disabled={loading}
          >
            {loading ? (
              <LoaderCircle className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <PlusIcon className="w-4 h-4" /> Add Client
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
