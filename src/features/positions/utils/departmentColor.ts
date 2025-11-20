export const getDepartmentColor = (department: string) => {
  const dept = department.toLowerCase();
  if (dept.includes("sales") && dept.includes("marketing")) {
    return "bg-blue-50 text-blue-900";
  }
  if (dept.includes("sales")) {
    return "bg-green-100 text-green-700";
  }
  if (dept.includes("marketing")) {
    return "bg-blue-100 text-blue-700";
  }
  if (dept.includes("engineering")) {
    return "bg-purple-100 text-purple-700";
  }
  if (dept.includes("design")) {
    return "bg-pink-100 text-pink-700";
  }
  if (dept.includes("analytics")) {
    return "bg-orange-100 text-orange-700";
  }
  if (dept.includes("customer success")) {
    return "bg-teal-100 text-teal-700";
  }
  if (dept.includes("finance")) {
    return "bg-yellow-100 text-yellow-700";
  }
  if (dept.includes("human resources") || dept.includes("hr")) {
    return "bg-indigo-100 text-indigo-700";
  }
  if (dept.includes("operations")) {
    return "bg-gray-100 text-gray-700";
  }
  if (dept.includes("product")) {
    return "bg-red-100 text-red-700";
  }
  if (dept.includes("documentation")) {
    return "bg-cyan-100 text-cyan-700";
  }
  if (dept.includes("it")) {
    return "bg-slate-100 text-slate-700";
  }
  if (dept.includes("business development")) {
    return "bg-emerald-100 text-emerald-700";
  }
  if (dept.includes("legal")) {
    return "bg-amber-100 text-amber-700";
  }
  if (dept.includes("r&d")) {
    return "bg-violet-100 text-violet-700";
  }
  if (dept.includes("security")) {
    return "bg-red-100 text-red-800";
  }
  if (dept.includes("quality assurance")) {
    return "bg-green-100 text-green-800";
  }
  if (dept.includes("administration")) {
    return "bg-stone-100 text-stone-700";
  }
  return "bg-gray-100 text-gray-700";
};
