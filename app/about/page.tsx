import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Clock, Download, Shield, Upload } from "lucide-react";

export const metadata: Metadata = {
  title: 'About - Secure FileShare',
  description: 'Learn about Secure FileShare and how it works',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex flex-col items-center justify-center gap-8 py-8">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            About Secure File Share
          </h1>
          <p className="text-lg text-muted-foreground">
            Your secure solution for temporary file sharing
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <p>
              Secure File Share is designed to make sharing files easy, secure, and private. Our platform leverages modern encryption and temporary storage to ensure your files remain protected during the sharing process.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Simple Uploads</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Drag and drop your files directly in your browser. No account required.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Secure Links</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Each upload generates a unique, hard-to-guess link for sharing your file.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Expiration Control</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Set your file to expire after a certain time period or number of downloads.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Privacy First</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  Files are automatically deleted after expiration. We don't track or analyze your content.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">Security Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>End-to-end encrypted file transfers</li>
              <li>Automatic file deletion after expiration</li>
              <li>Randomly generated, secure download URLs</li>
              <li>CAPTCHA protection against automated abuse</li>
              <li>No tracking or analytics on your files</li>
              <li>No executable (.exe) files allowed for security</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 