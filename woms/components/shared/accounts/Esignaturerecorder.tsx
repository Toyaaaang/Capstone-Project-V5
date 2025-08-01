"use client";

import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { toast } from "sonner";

interface ESignatureRecorderProps {
  isOpen: boolean;
  onClose: () => void;
  onSignatureFetched: (url: string) => void;
  existingSignatureUrl?: string; // <-- add this
}

export default function ESignatureRecorder({
  isOpen,
  onClose,
  onSignatureFetched,
  existingSignatureUrl, // <-- add this
}: ESignatureRecorderProps) {
  const signaturePadRef = useRef<SignatureCanvas>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Load existing signature when dialog opens
  useEffect(() => {
    if (isOpen) setIsEditing(false);
  }, [isOpen]);

  const handleClear = () => {
    signaturePadRef.current?.clear();
    setIsEditing(true);
    toast.info("Signature cleared. You can now draw a new one.");
  };

  const handleSave = async () => {
    if (signaturePadRef.current?.isEmpty()) {
        toast.error("Please draw your signature first!");
        return;
    }

    const dataUrl = signaturePadRef.current?.toDataURL("image/png");
    if (!dataUrl) {
        toast.error("Unable to capture signature. Please try again.");
        return;
    }

    // Convert dataURL to Blob
    function dataURLtoBlob(dataurl: string) {
        const arr = dataurl.split(",");
        const mime = arr[0].match(/:(.*?);/)![1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    const blob = dataURLtoBlob(dataUrl);
    const formData = new FormData();
    formData.append("image", blob, "signature.png");

    try {
        setIsSaving(true);
        const res = await fetch("/api/auth/save-signature", {
        method: "POST",
        body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");

        const data = await res.json();
        const signatureUrl = data.url;

        toast.success("Signature uploaded successfully!");
        onSignatureFetched(signatureUrl);
        onClose();
    } catch (err) {
        console.error("Error uploading signature:", err);
        toast.error("Failed to upload signature. Try again.");
    } finally {
        setIsSaving(false);
    }
    };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full h-auto">
        <DialogHeader>
          <DialogTitle>E-Signature Recorder</DialogTitle>
        </DialogHeader>
        <div className="p-4 flex flex-col items-center">
          {existingSignatureUrl && !isEditing ? (
            <>
              <img
                src={existingSignatureUrl}
                alt="Current signature"
                className="border border-gray-300 rounded mb-4"
                style={{ width: 420, height: 300, objectFit: "contain" }}
              />
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="w-full"
              >
                <X className="mr-1" />
                Clear to Edit
              </Button>
            </>
          ) : (
            <>
              <SignatureCanvas
                ref={signaturePadRef}
                penColor="black"
                canvasProps={{
                  width: 420,
                  height: 300,
                  className: "border border-gray-300 rounded mb-4",
                }}
              />
              <Button
                variant="outline"
                onClick={() => signaturePadRef.current?.clear()}
                className="w-full"
              >
                <X className="mr-1" />
                Clear
              </Button>
            </>
          )}
        </div>
        <DialogFooter>
          <Button
            className="w-full"
            onClick={handleSave}
            disabled={isSaving || (!isEditing && !!existingSignatureUrl)}
          >
            <Save className="mr-1" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}