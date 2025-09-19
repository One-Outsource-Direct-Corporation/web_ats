import { LoaderCircle } from "lucide-react";

export default function LoadingComponent({ message }: { message?: string }) {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <LoaderCircle className="animate-spin w-12 h-12" color="#0056d2" />
      <p className="font-semibold text-muted-foreground mt-2">
        {message || "Please wait"}
      </p>
    </div>
  );
}
