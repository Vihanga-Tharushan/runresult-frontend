import { createClient } from "@supabase/supabase-js";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6dGpnb29rc3dtaHlvY3hhYml5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1OTUxNzEsImV4cCI6MjA5OTE3MTE3MX0.JNcYYH4boYAAqQAJ5zMIgrOf4_2rfXsuFnxkeXbsokg";
const supabaseUrl = "https://iztjgookswmhyocxabiy.supabase.co";
const supabase = createClient(supabaseUrl, anonKey);

export default function mediaUpload(file) {
  return new Promise((resolve, reject) => {
    if (file == null) {
      reject("No file selected");
    } else {
      const timestamp = new Date().getTime();
      const fileName = timestamp + file.name;

      supabase.storage
        .from("images")
        .upload(fileName, file, {
          upsert: false,
          cacheControl: "3600",
        })
        .then(() => {
          const publicUrl = supabase.storage
            .from("images")
            .getPublicUrl(fileName).data.publicUrl;
          resolve(publicUrl);
        })
        .catch((err) => {
          reject(err.message || "An error occurred");
        });
    }
  });
}