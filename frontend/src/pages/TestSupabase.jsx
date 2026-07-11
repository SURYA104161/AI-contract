import { useEffect } from "react";
import { supabase } from "../supabase/supabaseClient";

export default function TestSupabase() {
  useEffect(() => {
    async function test() {
      const { data, error } = await supabase.auth.getSession();
      console.log(data);
      console.log(error);
    }

    test();
  }, []);

  return (
    <h1>Supabase Connected ✅</h1>
  );
}
