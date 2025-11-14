import React from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Field, FieldLabel } from "../../ui/field";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Assessment } from "@/shared/types/pipeline.types";

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  templates: Assessment[];
  templatesLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  onSearch: (value: string) => void;
}

export function TemplateSelector({
  selectedTemplate,
  onTemplateSelect,
  templates,
  templatesLoading,
  hasMore,
  loadMore,
  onSearch,
}: TemplateSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (templateId: string) => {
    const newValue = templateId === selectedTemplate ? "" : templateId;
    onTemplateSelect(newValue);
    setOpen(false);
  };

  return (
    <Field>
      <FieldLabel className="text-sm font-medium text-gray-700 mb-2 block">
        Select Template
      </FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedTemplate
              ? templates.find((template) => {
                  if ("id" in template) {
                    return String(template.id) === selectedTemplate;
                  }
                  return false;
                })?.name || "Browse Templates"
              : "Browse Templates"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search templates..."
              className="h-9"
              onValueChange={onSearch}
            />
            <CommandList
              onScroll={(e) => {
                const target = e.currentTarget;
                if (
                  target.scrollHeight - target.scrollTop <=
                    target.clientHeight + 100 &&
                  hasMore &&
                  !templatesLoading
                ) {
                  loadMore();
                }
              }}
              className="max-h-[300px] overflow-y-auto"
            >
              <CommandEmpty>
                {templatesLoading ? "Loading..." : "No template found."}
              </CommandEmpty>
              <CommandGroup>
                {templates.map((template) => {
                  const templateId = "id" in template ? template.id : null;
                  const templateKey =
                    "id" in template ? template.id : template.tempId;

                  if (!templateId) return null;

                  return (
                    <CommandItem
                      key={templateKey}
                      value={String(templateId)}
                      onSelect={() => handleSelect(String(templateId))}
                    >
                      <div className="flex flex-col flex-1">
                        <span className="font-medium">{template.name}</span>
                        <span className="text-xs text-gray-500">
                          {template.type}
                        </span>
                      </div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4 flex-shrink-0",
                          selectedTemplate === String(templateId)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  );
                })}
                {hasMore && !templatesLoading && (
                  <CommandItem
                    disabled
                    className="justify-center text-sm text-gray-500"
                  >
                    Scroll for more...
                  </CommandItem>
                )}
                {templatesLoading && (
                  <CommandItem
                    disabled
                    className="justify-center text-sm text-gray-500"
                  >
                    Loading more...
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedTemplate && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onTemplateSelect("")}
          className="mt-2 text-sm text-gray-600 hover:text-gray-900"
        >
          Clear Template
        </Button>
      )}
    </Field>
  );
}
