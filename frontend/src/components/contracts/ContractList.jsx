import { useCallback, useEffect, useState } from "react";
import { getContracts, deleteContract } from "../../services/api";
import ContractCard from "./ContractCard";
import EmptyContracts from "./EmptyContracts";

const ContractList = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getContracts();
      setContracts(data);
    } catch (err) {
      console.error("Failed to fetch contracts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const handleDelete = async (contract) => {
    const confirmDelete = window.confirm(
      `Delete "${contract.original_file_name}"?`
    );

    if (!confirmDelete) return;

    try {
      await deleteContract(contract.id);
      fetchContracts();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete contract");
    }
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
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default ContractList;
