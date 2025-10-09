export const getDepartmentColor = (department: string) => {
  console.log(department);
  switch (department) {
    case "Marketing":
      return "bg-blue-100 text-blue-700";
    case "Engineering":
      return "bg-purple-100 text-purple-700";
    case "Sales":
      return "bg-green-100 text-green-700";
    case "Design":
      return "bg-pink-100 text-pink-700";
    case "Analytics":
      return "bg-orange-100 text-orange-700";
    case "Customer Success":
      return "bg-teal-100 text-teal-700";
    case "Finance":
      return "bg-yellow-100 text-yellow-700";
    case "Human Resources":
    case "Hr":
      return "bg-indigo-100 text-indigo-700";
    case "Operations":
      return "bg-gray-100 text-gray-700";
    case "Product":
      return "bg-red-100 text-red-700";
    case "Documentation":
      return "bg-cyan-100 text-cyan-700";
    case "IT":
      return "bg-slate-100 text-slate-700";
    case "Business Development":
      return "bg-emerald-100 text-emerald-700";
    case "Legal":
      return "bg-amber-100 text-amber-700";
    case "R&D":
      return "bg-violet-100 text-violet-700";
    case "Security":
      return "bg-red-100 text-red-800";
    case "Quality Assurance":
      return "bg-green-100 text-green-800";
    case "Administration":
      return "bg-stone-100 text-stone-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};
