import React from "react";
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

interface RichTextEditorProps {
  jobDescriptionRef: React.RefObject<HTMLDivElement | null>;
  jobDescription: string;
  setJobDescription: (description: string) => void;
  showAlignmentOptions: boolean;
  setShowAlignmentOptions: (show: boolean) => void;
  onFormat: (command: string, value?: string) => void;
  onAlignment: (alignment: "Left" | "Center" | "Right") => void;
  onList: () => void;
  onLink: () => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  jobDescriptionRef,
  jobDescription,
  setJobDescription,
  showAlignmentOptions,
  setShowAlignmentOptions,
  onFormat,
  onAlignment,
  onList,
  onLink,
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Job Description
      </h3>

      {/* Rich Text Editor Toolbar */}
      <div className="border-b border-gray-300 pb-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => onFormat("bold")}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onFormat("italic")}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onFormat("underline")}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <Underline className="w-4 h-4" />
          </Button>

          <div className="h-6 border-l border-gray-300 mx-2" />

          <div className="relative">
            <Button
              onClick={() => setShowAlignmentOptions(!showAlignmentOptions)}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <AlignLeft className="w-4 h-4" />
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>

            {showAlignmentOptions && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10">
                <Button
                  onClick={() => onAlignment("Left")}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start px-3 py-2"
                >
                  <AlignLeft className="w-4 h-4 mr-2" />
                  Left
                </Button>
                <Button
                  onClick={() => onAlignment("Center")}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start px-3 py-2"
                >
                  <AlignCenter className="w-4 h-4 mr-2" />
                  Center
                </Button>
                <Button
                  onClick={() => onAlignment("Right")}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start px-3 py-2"
                >
                  <AlignRight className="w-4 h-4 mr-2" />
                  Right
                </Button>
              </div>
            )}
          </div>

          <Button onClick={onList} variant="ghost" size="sm" className="p-2">
            <List className="w-4 h-4" />
          </Button>

          <Button onClick={onLink} variant="ghost" size="sm" className="p-2">
            <Link className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Rich Text Content Area */}
      <div
        ref={jobDescriptionRef}
        contentEditable
        suppressContentEditableWarning={true}
        className="min-h-[400px] p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        dangerouslySetInnerHTML={{ __html: jobDescription }}
        onInput={(e) => setJobDescription(e.currentTarget.innerHTML)}
      />
    </div>
  );
};
