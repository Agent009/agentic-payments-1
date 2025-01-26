"use client";

import { constants, getApiUrl } from "@/lib";

export const handleFileUpload = async (file: File): Promise<{ url: string | null; error: string | null }> => {
  try {
    if (!file) {
      console.debug("lib -> pinata -> utils -> handleFileUpload -> no file selected");
      return { url: null, error: "No file selected" };
    }

    // Upload the file
    const data = new FormData();
    data.set("file", file);
    const uploadRequest = await fetch(getApiUrl(constants.routes.api.files), {
      method: "POST",
      body: data,
    });
    const payload = await uploadRequest.json();

    if (payload.error) {
      console.error("lib -> pinata -> utils -> handleFileUpload -> error uploading file", payload.error);
      return { url: null, error: payload.error };
    }

    console.debug("lib -> pinata -> utils -> handleFileUpload -> file uploaded successfully", payload);
    return { url: payload.url, error: null };
  } catch (e) {
    console.log("lib -> pinata -> utils -> handleFileUpload -> error", e);
    return { url: null, error: "There was an error uploading the file" };
  }
};
