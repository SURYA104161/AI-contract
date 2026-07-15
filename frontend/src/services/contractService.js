import { supabase } from "../supabase/supabaseClient";
import { uploadDocument, analyzeDocument } from "./api";

export const uploadContract = async (file, userId, language = "en") => {
  const uploadResult = await uploadDocument(file);

  const contractId = uploadResult.contract_id;

  analyzeDocument(contractId, language).catch((err) => {
    console.error("Background analysis failed:", err);
  });

  return {
    contract_id: contractId,
    filename: uploadResult.filename,
    text_length: uploadResult.text_length,
    document_type: uploadResult.document_type,
  };
};
