import { supabase } from "../supabase/supabaseClient";

export const uploadContract = async (file, userId) => {
  const storedFileName = `${Date.now()}-${file.name}`;
  const storagePath = `${userId}/${storedFileName}`;

  // Upload PDF to Storage
  const { error: uploadError } = await supabase.storage
    .from("contracts")
    .upload(storagePath, file);

  if (uploadError) throw uploadError;

  // Get Public URL
  const {
    data: { publicUrl },
  } = supabase.storage
    .from("contracts")
    .getPublicUrl(storagePath);

  // Save metadata
  const { error: dbError } = await supabase
    .from("contracts")
    .insert({
      user_id: userId,
      original_file_name: file.name,
      stored_file_name: storedFileName,
      storage_path: storagePath,
      file_url: publicUrl,
      file_size: file.size,
      mime_type: file.type,
      status: "Uploaded",
    });

  if (dbError) throw dbError;

  return publicUrl;
};
