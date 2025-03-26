import { Metadata } from "next";
import FileDownload from "@/components/file-download";

export const metadata: Metadata = {
  title: 'Download File - Secure File Share',
  description: 'Download your securely shared file',
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function DownloadPage({ params }: PageProps) {
  return (
    <div className="container mx-auto max-w-5xl">
      <div className="flex flex-col items-center justify-center py-8">
        <FileDownload fileId={params.id} />
      </div>
    </div>
  );
} 