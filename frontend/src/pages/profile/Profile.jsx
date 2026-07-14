import MainLayout from "../../components/layout/MainLayout";
import ProfileCard from "../../components/profile/ProfileCard";
import ProfileForm from "../../components/profile/ProfileForm";
import AccountStats from "../../components/profile/AccountStats";
import SecurityCard from "../../components/profile/SecurityCard";

const Profile = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold">Profile</h1>

        <p className="text-slate-400 mt-2 mb-8">
          Manage your account information.
        </p>

        <ProfileCard />

        <div className="mt-8">
          <ProfileForm />
        </div>

        <div className="mt-8">
          <AccountStats />
        </div>

        <div className="mt-8">
          <SecurityCard />
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
