import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://iztjgookswmhyocxabiy.supabase.co";
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6dGpnb29rc3dtaH95Y3hhYml5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1OTUxNzEsImV4cCI6MjA5OTE3MTE3MX0.JNcYYH4boYAAqQAJ5zMIgrOf4_2rfXsuFnxkeXbsokg";
const bucketName = import.meta.env.VITE_SUPABASE_BUCKET || "images";

let client = null;

function getClient() {
  if (!supabaseUrl || !anonKey) {
    throw new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  }
  if (!client) {
    client = createClient(supabaseUrl, anonKey);
  }
  return client;
}

function describeError(error) {
  const message = error?.message || "An error occurred";

  if (/signature verification failed|invalid jwt|jwt/i.test(message)) {
    return "Supabase credentials are invalid or expired. Check VITE_SUPABASE_ANON_KEY in the environment file.";
  }
  if (/row-level security|new row violates policy|permission denied/i.test(message)) {
    return `Supabase denied the upload. Check the storage policies for the "${bucketName}" bucket.`;
  }
  if (/exceeded the maximum allowed size|413|entity too large/i.test(message)) {
    return "The file is too large to upload.";
  }
  if (/bucket not found/i.test(message)) {
    return `The storage bucket "${bucketName}" does not exist.`;
  }

  return message;
}

async function isPubliclyAccessible(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

export default async function mediaUpload(file) {
  if (!file) throw new Error("No file selected");

  const supabase = getClient();
  const fileName = `${Date.now()}_${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file, {
      upsert: false,
      cacheControl: "3600",
      contentType: file.type || undefined,
    });

  if (uploadError) {
    throw new Error(describeError(uploadError));
  }

  const publicUrl = supabase.storage.from(bucketName).getPublicUrl(fileName).data.publicUrl;

  const accessible = await isPubliclyAccessible(publicUrl);
  if (!accessible) {
    await supabase.storage.from(bucketName).remove([fileName]);
    throw new Error(`The file was uploaded but is not publicly reachable. Make the "${bucketName}" bucket public.`);
  }

  return publicUrl;
}
