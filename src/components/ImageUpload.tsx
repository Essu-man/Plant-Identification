import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  onImageUpload?: (file: File) => void;
  maxSize?: number;
  acceptedFileTypes?: string[];
}

const ImageUpload = ({
  onImageUpload = () => {},
  maxSize = 5242880, // 5MB
  acceptedFileTypes = ["image/jpeg", "image/png", "image/webp"],
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      const file = acceptedFiles[0];

      if (file) {
        if (file.size > maxSize) {
          setError("File is too large. Maximum size is 5MB.");
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        onImageUpload(file);
      }
    },
    [maxSize, onImageUpload],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce(
      (acc, curr) => ({ ...acc, [curr]: [] }),
      {},
    ),
    maxSize,
    multiple: false,
  });

  const clearPreview = () => {
    setPreview(null);
    setError(null);
  };

  return (
    <Card className="w-full max-w-[600px] bg-white p-6 relative">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-green-400"}
          ${preview ? "border-none p-0" : ""}`}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation();
                clearPreview();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <p className="text-lg font-medium text-gray-900">
                Drag and drop your plant image here
              </p>
              <p className="text-sm text-gray-500 mt-1">
                or click to select a file
              </p>
            </div>
            <Button variant="outline" type="button">
              Select Image
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: JPEG, PNG, WebP (max 5MB)
            </p>
          </div>
        )}
      </div>

      {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
    </Card>
  );
};

export default ImageUpload;
