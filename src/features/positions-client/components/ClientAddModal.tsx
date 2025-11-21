import React, { useState, useEffect } from "react";
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
import { LoaderCircle, PlusCircle, PlusIcon } from "lucide-react";
import { type ClientBase } from "../types/create_position.types";
import { validateEmail } from "@/shared/utils/validators";
import type { AxiosError } from "axios";
import useAxiosPrivate from "@/features/auth/hooks/useAxiosPrivate";
import { toast } from "react-toastify";

export default function ClientAddModal({
  onClientAdded,
}: {
  onClientAdded?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [open, setOpen] = useState(false);
  const [clientForm, setClientForm] = useState<ClientBase>({
    name: "",
    email: "",
    contact_number: "",
  });

  function resetForm() {
    setClientForm({
      name: "",
      email: "",
      contact_number: "",
    });
    setErrors({});
    setOpen(false);
  }

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    if (open) {
      setClientForm({
        name: "",
        email: "",
        contact_number: "",
      });
      setErrors({});
    }
  }, [open]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log("Submitting form:", clientForm);

    setErrors({});
    const errorsForm: { [key: string]: string } = {};

    if (clientForm.name.trim() === "") {
      errorsForm.name = "Client name is required";
    }

    if (!validateEmail(clientForm.email)) {
      errorsForm.email = "Client email is invalid";
    }

    if (clientForm.contact_number.trim() === "") {
      errorsForm.contact_number = "Contact number is required";
    }

    if (Object.keys(errorsForm).length > 0) {
      setErrors(errorsForm);
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
    } catch (err: AxiosError | any) {
      console.error("Error adding client:", err);
      toast.error("Failed to add client. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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
                onChange={(e) =>
                  setClientForm({ ...clientForm, name: e.target.value })
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
                onChange={(e) =>
                  setClientForm({ ...clientForm, email: e.target.value })
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
                onChange={(e) =>
                  setClientForm({
                    ...clientForm,
                    contact_number: e.target.value,
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
              <>
                <LoaderCircle className="w-4 h-4 animate-spin" />
              </>
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
