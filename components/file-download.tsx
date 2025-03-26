"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/lib/hooks/use-toast';
import { Download, FileIcon, Clock, AlertCircle } from 'lucide-react';

interface FileData {
  id: string;
  filename: string;
  size: number;
  mime_type: string;
  download_limit: number;
  download_count: number;
  expires_at: string;
  storage_path: string;
}

export default function FileDownload({ fileId }: { fileId: string }) {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchFileData() {
      try {
        setLoading(true);
        
        // Get file data from database
        const { data, error } = await supabase
          .from('files')
          .select('*')
          .eq('id', fileId)
          .single();
        
        if (error) throw error;
        
        if (!data) {
          setError('File not found or link has expired.');
          setLoading(false);
          return;
        }

        // Check if file has expired
        const now = new Date();
        const expiryDate = new Date(data.expires_at);
        
        if (now > expiryDate) {
          setError('This download link has expired.');
          setLoading(false);
          return;
        }
        
        // Check if download limit reached
        if (data.download_count >= data.download_limit) {
          setError('This download link has reached its maximum number of downloads.');
          setLoading(false);
          return;
        }
        
        setFileData(data);
      } catch (err) {
        console.error('Error fetching file:', err);
        setError('Error loading file information. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    if (fileId) {
      fetchFileData();
    }
  }, [fileId]);

  const handleDownload = async () => {
    if (!fileData) return;

    try {
      setDownloading(true);

      // Get file from storage
      const { data, error } = await supabase.storage
        .from('files')
        .download(fileData.storage_path);
      
      if (error) throw error;
      
      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileData.filename;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Update download count
      const { error: updateError } = await supabase
        .from('files')
        .update({ download_count: fileData.download_count + 1 })
        .eq('id', fileId);
      
      if (updateError) throw updateError;
      
      // If this was the last download allowed, show a message
      if (fileData.download_count + 1 >= fileData.download_limit) {
        toast({
          title: "Download complete",
          description: "This was the final download allowed for this file.",
        });
        
        // Redirect to homepage after a short delay
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        toast({
          title: "Download complete",
          description: "Your file has been downloaded successfully.",
        });
        
        // Update the local state to reflect the new download count
        setFileData({
          ...fileData,
          download_count: fileData.download_count + 1
        });
      }
    } catch (err) {
      console.error('Download error:', err);
      toast({
        title: "Download failed",
        description: "There was an error downloading your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const getTimeRemaining = () => {
    if (!fileData) return '';
    
    const now = new Date();
    const expiryDate = new Date(fileData.expires_at);
    const diffMs = expiryDate.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
    }
    
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <p>Loading file information...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-xl text-destructive">Download Error</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
          <p>{error}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push('/')} variant="outline" className="w-full">
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (!fileData) return null;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">Download Your File</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center mb-6">
          <FileIcon className="w-16 h-16 text-primary/80" />
        </div>
        
        <div className="space-y-4">
          <div className="p-3 bg-secondary/50 rounded-md">
            <div className="flex flex-col">
              <span className="font-medium text-lg truncate mb-1">{fileData.filename}</span>
              <span className="text-sm text-muted-foreground">{formatFileSize(fileData.size)}</span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <Download className="w-4 h-4 text-muted-foreground" />
              <span>
                {fileData.download_limit - fileData.download_count} download{fileData.download_limit - fileData.download_count !== 1 ? 's' : ''} remaining
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>Link expires in {getTimeRemaining()}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleDownload} 
          disabled={downloading}
          className="w-full"
          size="lg"
        >
          {downloading ? "Downloading..." : "Download File"}
        </Button>
      </CardFooter>
    </Card>
  );
} 