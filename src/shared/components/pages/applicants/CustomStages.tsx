"use client"
import { useParams } from "react-router-dom"
import OfferAndFinalization from "@/components/pages/applicants/OfferAndFinalization"
import Onboarding from "@/components/pages/applicants/Onboarding"
import Warm from "@/components/pages/applicants/Warm"
import Failed from "@/components/pages/applicants/Failed"

export default function TemplatePage() {
  const { customStage } = useParams<{ customStage: string }>()

  const renderStageComponent = () => {
    switch (customStage) {
      case "OfferAndFinalization":
        return <OfferAndFinalization />
      case "Onboarding":
        return <Onboarding />
      case "Warm":
        return <Warm />
      case "Failed":
        return <Failed />
      default:
        return (
          <div className="min-h-screen bg-gray-50 p-4 mt-20">
            <div className="mx-auto max-w-7xl">
              <div className="text-center py-8 text-gray-500">Stage not found: {customStage}</div>
            </div>
          </div>
        )
    }
  }

  return renderStageComponent()
}
