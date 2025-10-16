export function formatBackgroundStatus(status: string): string {
  switch (status) {
    case "draft":
      return "bg-yellow-50 text-yellow-700 hover:bg-yellow-100";
    case "pending":
      return "bg-blue-50 text-blue-700 hover:bg-blue-100";
    case "active":
      return "bg-green-50 text-green-700 hover:bg-green-100";
    case "closed":
      return "bg-gray-50 text-gray-700 hover:bg-gray-100";
    case "cancelled":
      return "bg-red-50 text-red-700 hover:bg-red-100";
    default:
      return "bg-gray-50 text-gray-700 hover:bg-gray-100";
  }
}
