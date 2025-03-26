"use client";

import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import ReCAPTCHA from 'react-google-recaptcha';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/lib/hooks/use-toast';
import { Upload, Clock, AlertCircle } from 'lucide-react';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const DISALLOWED_FILE_TYPES = ['.exe'];
const DEFAULT_DOWNLOAD_LIMIT = 1;
const DEFAULT_EXPIRY_HOURS = 24;

export default function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [downloadLimit, setDownloadLimit] = useState<number | ''>('');
  const [expiryHours, setExpiryHours] = useState<number | ''>('');
  const [downloadInputFocused, setDownloadInputFocused] = useState(false);
  const [expiryInputFocused, setExpiryInputFocused] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileLink, setFileLink] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    
    if (!selectedFile) return;
    
    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Maximum file size is 100MB",
        variant: "destructive",
      });
      return;
    }
    
    // Check file extension
    const fileExtension = selectedFile.name.slice(((selectedFile.name.lastIndexOf(".") - 1) >>> 0) + 1).toLowerCase();
    if (DISALLOWED_FILE_TYPES.includes(`.${fileExtension}`)) {
      toast({
        title: "File type not allowed",
        description: ".exe files are not permitted",
        variant: "destructive",
      });
      return;
    }
    
    setFile(selectedFile);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    multiple: false
  });

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaVerified(!!value);
  };

  const generateSecureId = () => {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  const handleUpload = async () => {
    if (!file || !captchaVerified) return;

    // Use default values if fields are empty
    const finalDownloadLimit = downloadLimit === '' ? DEFAULT_DOWNLOAD_LIMIT : downloadLimit;
    const finalExpiryHours = expiryHours === '' ? DEFAULT_EXPIRY_HOURS : expiryHours;

    try {
      setIsUploading(true);
      const secureId = generateSecureId();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${secureId}.${fileExtension}`;
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('files')
        .upload(fileName, file);
      
      if (error) throw error;
      
      // Calculate expiry time
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + Number(finalExpiryHours));
      
      // Save file metadata to database
      const { error: dbError } = await supabase
        .from('files')
        .insert({
          id: secureId,
          filename: file.name,
          storage_path: fileName,
          size: file.size,
          mime_type: file.type,
          download_limit: finalDownloadLimit,
          download_count: 0,
          expires_at: expiryDate.toISOString(),
        });
      
      if (dbError) throw dbError;
      
      // Generate and store link
      const downloadLink = `${window.location.origin}/download/${secureId}`;
      setFileLink(downloadLink);
      
      toast({
        title: "Upload successful!",
        description: "Your file has been uploaded and link has been generated.",
      });
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyLink = () => {
    if (fileLink) {
      navigator.clipboard.writeText(fileLink);
      toast({
        title: "Link copied",
        description: "Download link copied to clipboard",
      });
    }
  };

  const handleUploadAnother = () => {
    setFile(null);
    setFileLink(null);
    setCaptchaVerified(false);
    setDownloadLimit(DEFAULT_DOWNLOAD_LIMIT);
    setExpiryHours(DEFAULT_EXPIRY_HOURS);
    setDownloadInputFocused(false);
    setExpiryInputFocused(false);
  };

  if (fileLink) {
    // Use default values if fields are empty
    const finalDownloadLimit = downloadLimit === '' ? DEFAULT_DOWNLOAD_LIMIT : downloadLimit;
    const finalExpiryHours = expiryHours === '' ? DEFAULT_EXPIRY_HOURS : expiryHours;

    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">File Uploaded Successfully!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-sm mb-2 font-medium">Your secure download link:</p>
            <div className="flex items-center">
              <Input 
                value={fileLink} 
                readOnly 
                className="flex-1 font-mono text-sm" 
              />
              <Button 
                onClick={handleCopyLink} 
                variant="outline" 
                className="ml-2"
              >
                Copy
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              Expires after {finalDownloadLimit} download{finalDownloadLimit !== 1 ? 's' : ''} or {finalExpiryHours} hour{finalExpiryHours !== 1 ? 's' : ''}, whichever comes first.
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleUploadAnother} variant="outline" className="w-full">
            Upload Another File
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          Upload Your File
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div 
          {...getRootProps()} 
          className={`
            border-2 border-dashed rounded-md p-8 
            text-center cursor-pointer transition-colors
            ${isDragActive ? 
              'border-primary bg-primary/5' : 
              'border-muted-foreground/20 hover:border-primary/50'
            }
          `}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium">
            {isDragActive
              ? "Drop your file here"
              : "Drag your file here or click to browse"
            }
          </p>
          {file && (
            <div className="mt-4 p-2 bg-secondary rounded-md">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium">Expiration Settings</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                Download counter
              </label>
              <div className="relative">
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={downloadInputFocused || downloadLimit !== '' ? downloadLimit : ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setDownloadLimit('');
                    } else {
                      const num = parseInt(value);
                      if (!isNaN(num)) {
                        setDownloadLimit(Math.min(10, Math.max(1, num)));
                      }
                    }
                  }}
                  onFocus={() => setDownloadInputFocused(true)}
                  onBlur={() => setDownloadInputFocused(false)}
                  className={downloadInputFocused || downloadLimit !== '' ? '' : 'text-muted-foreground'}
                />
                {!downloadInputFocused && downloadLimit === '' && (
                  <div className="absolute inset-0 flex items-center pointer-events-none text-muted-foreground pl-3 text-sm">
                    Defaults to 1 download
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                Timer (hours)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  min="1"
                  max="168"
                  value={expiryInputFocused || expiryHours !== '' ? expiryHours : ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setExpiryHours('');
                    } else {
                      const num = parseInt(value);
                      if (!isNaN(num)) {
                        setExpiryHours(Math.min(168, Math.max(1, num)));
                      }
                    }
                  }}
                  onFocus={() => setExpiryInputFocused(true)}
                  onBlur={() => setExpiryInputFocused(false)}
                  className={expiryInputFocused || expiryHours !== '' ? '' : 'text-muted-foreground'}
                />
                {!expiryInputFocused && expiryHours === '' && (
                  <div className="absolute inset-0 flex items-center pointer-events-none text-muted-foreground pl-3 text-sm">
                    Defaults to 24 hours
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full flex justify-center">
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
            onChange={handleCaptchaChange}
          />
        </div>

        {!file && (
          <div className="flex items-center p-2 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-500 mr-2" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Please select a file to upload. Maximum file size: 100MB.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpload}
          disabled={!file || !captchaVerified || isUploading}
          className="w-full"
          size="lg"
        >
          {isUploading ? "Uploading..." : "Upload & Get Link"}
        </Button>
      </CardFooter>
    </Card>
  );
} 