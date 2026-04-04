import { Facebook, Briefcase, Linkedin, Mail } from "lucide-react";

export const CareersFooter: React.FC = () => {
  return (
    <footer className="w-full mx-auto h-30 mt-0 bg-blue-600 rounded-t-2xl p-8 relative z-10">
      <div className="text-center">
        <div className="flex justify-center gap-6 mb-4">
          <Facebook className="h-6 w-6 text-white" />
          <Briefcase className="h-6 w-6 text-white" />
          <Linkedin className="h-6 w-6 text-white" />
          <Mail className="h-6 w-6 text-white" />
        </div>
        <div className="text-white text-sm">
          © 2025 One Outsource Direct Group • Privacy • Terms • Sitemap
        </div>
      </div>
    </footer>
  );
};
