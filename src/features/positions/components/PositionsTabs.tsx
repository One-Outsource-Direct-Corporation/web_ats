import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import type { TabType, PublishedSubTabType } from "../types/position.types";

interface PositionsTabsProps {
  currentTab: TabType;
  publishedSubTab: PublishedSubTabType;
  onTabChange: (value: string) => void;
  onPublishedSubTabChange: (value: PublishedSubTabType) => void;
}

export default function PositionsTabs({
  currentTab,
  publishedSubTab,
  onTabChange,
  onPublishedSubTabChange,
}: PositionsTabsProps) {
  const mainTabs = [
    "drafts",
    "on-hold",
    "published",
    "closed",
    "archive",
    "deleted",
  ] as const;

  const publishedSubTabs = ["all", "Internal", "External"] as const;

  return (
    <>
      {/* Main Tabs */}
      <div className="flex items-center pb-2">
        <Tabs value={currentTab} onValueChange={onTabChange} className="w-auto">
          <TabsList className="flex gap-4 bg-transparent border-b-0">
            {mainTabs.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="relative px-2 pb-2 text-sm font-medium text-gray-500 data-[state=active]:text-blue-600"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace("-", " ")}
                <span className="absolute left-0 -bottom-0.5 w-full h-0.5 bg-blue-600 scale-x-0 data-[state=active]:scale-x-100 transition-transform origin-left" />
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Published Sub-tabs */}
      {currentTab === "published" && (
        <div className="flex items-center pb-2">
          <Tabs
            value={publishedSubTab}
            onValueChange={(value) =>
              onPublishedSubTabChange(value as PublishedSubTabType)
            }
            className="w-auto"
          >
            <TabsList className="flex gap-4 bg-transparent border-b-0 ml-4">
              {publishedSubTabs.map((subtab) => (
                <TabsTrigger
                  key={subtab}
                  value={subtab}
                  className="relative px-2 pb-2 text-xs font-medium text-gray-400 data-[state=active]:text-blue-500"
                >
                  {subtab.charAt(0).toUpperCase() + subtab.slice(1)}
                  <span className="absolute left-0 -bottom-0.5 w-full h-0.5 bg-blue-500 scale-x-0 data-[state=active]:scale-x-100 transition-transform origin-left" />
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}
    </>
  );
}
