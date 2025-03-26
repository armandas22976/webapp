import FileUploadForm from "@/components/file-upload-form";

export default function Home() {
  return (
    <div className="container mx-auto max-w-5xl">
      <div className="flex flex-col items-center justify-center gap-8 py-8">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Share Your Files Anonymously
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload files with expiration settings and get a secure download link for sharing.
          </p>
        </div>
        <FileUploadForm />
      </div>
    </div>
  );
}