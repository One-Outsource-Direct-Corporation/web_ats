import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  Link,
  ChevronDown,
} from "lucide-react";

interface DescriptionStepProps {
  jobDescription: string;
  setJobDescription: (description: string) => void;
  jobDescriptionRef: React.RefObject<HTMLDivElement | null>;
  showAlignmentOptions: boolean;
  setShowAlignmentOptions: (show: boolean) => void;
  onFormat: (command: string, value?: string) => void;
  onAlignment: (alignment: "Left" | "Center" | "Right") => void;
  onList: () => void;
  onLink: () => void;
}

export default function DescriptionStep({
  jobDescription,
  setJobDescription,
  jobDescriptionRef,
  showAlignmentOptions,
  setShowAlignmentOptions,
  onFormat,
  onAlignment,
  onList,
  onLink,
}: DescriptionStepProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Job Description</h3>

          {/* Rich Text Editor Toolbar */}
          <div className="border border-gray-200 rounded-lg">
            <div className="flex flex-wrap items-center gap-2 p-3 border-b border-gray-200 bg-gray-50">
              {/* Formatting Buttons */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFormat("bold")}
                className="h-8 w-8 p-0"
                type="button"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFormat("italic")}
                className="h-8 w-8 p-0"
                type="button"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFormat("underline")}
                className="h-8 w-8 p-0"
                type="button"
              >
                <Underline className="h-4 w-4" />
              </Button>

              <div className="w-px h-6 bg-gray-300 mx-1" />

              {/* Alignment Dropdown */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAlignmentOptions(!showAlignmentOptions)}
                  className="h-8 px-2"
                  type="button"
                >
                  <AlignLeft className="h-4 w-4 mr-1" />
                  <ChevronDown className="h-3 w-3" />
                </Button>
                {showAlignmentOptions && (
                  <div className="absolute top-9 left-0 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onAlignment("Left")}
                      className="w-full justify-start h-8 px-3"
                      type="button"
                    >
                      <AlignLeft className="h-4 w-4 mr-2" />
                      Left
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onAlignment("Center")}
                      className="w-full justify-start h-8 px-3"
                      type="button"
                    >
                      <AlignCenter className="h-4 w-4 mr-2" />
                      Center
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onAlignment("Right")}
                      className="w-full justify-start h-8 px-3"
                      type="button"
                    >
                      <AlignRight className="h-4 w-4 mr-2" />
                      Right
                    </Button>
                  </div>
                )}
              </div>

              <div className="w-px h-6 bg-gray-300 mx-1" />

              {/* List and Link Buttons */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onList}
                className="h-8 w-8 p-0"
                type="button"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLink}
                className="h-8 w-8 p-0"
                type="button"
              >
                <Link className="h-4 w-4" />
              </Button>
            </div>

            {/* Rich Text Content Area */}
            <div
              ref={jobDescriptionRef}
              contentEditable
              className="min-h-[400px] p-4 focus:outline-none"
              dangerouslySetInnerHTML={{ __html: jobDescription }}
              onInput={(e) => {
                const target = e.target as HTMLDivElement;
                setJobDescription(target.innerHTML);
              }}
              style={{
                lineHeight: "1.6",
                fontSize: "14px",
                color: "#333",
              }}
            />
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Use the toolbar above to format your job description. You can make
            text bold, italic, underlined, create lists, add links, and adjust
            text alignment.
          </p>
        </div>
      </div>
    </Card>
  );
}
