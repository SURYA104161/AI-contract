import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../supabase/supabaseClient";
import { useAuthContext } from "../../context/AuthContext";
import ContractCard from "./ContractCard";
import EmptyContracts from "./EmptyContracts";

const ContractList = () => {
  const { user } = useAuthContext();

  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContracts = useCallback(async () => {
    if (!user) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("contracts")
      .select("*")
      .eq("user_id", user.id)
      .order("uploaded_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setContracts(data);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    fetchContracts();
  }, [user, fetchContracts]);

  const deleteContract = async (contract) => {
    const confirmDelete = window.confirm(
      `Delete "${contract.original_file_name}"?`
    );

    if (!confirmDelete) return;

    // Delete file from storage
    await supabase.storage
      .from("contracts")
      .remove([contract.stored_file_name]);

    // Delete row
    await supabase
      .from("contracts")
      .delete()
      .eq("id", contract.id);

    fetchContracts();
  };

  if (loading) {
    return (
      <div className="text-center text-slate-400 py-20">
        Loading contracts...
      </div>
    );
  }

  if (contracts.length === 0) {
    return <EmptyContracts />;
  }

  return (
    <div className="space-y-5">
      {contracts.map((contract) => (
        <ContractCard
          key={contract.id}
          contract={contract}
          onDelete={deleteContract}
        />
      ))}
    </div>
  );
};

export default ContractList;
