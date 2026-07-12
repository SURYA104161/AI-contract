import MainLayout from "../../components/layout/MainLayout";
import ContractList from "../../components/contracts/ContractList";

const Contracts = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">My Contracts</h1>

        <ContractList />
      </div>
    </MainLayout>
  );
};

export default Contracts;
