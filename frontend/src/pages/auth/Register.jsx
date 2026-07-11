import AuthLayout from "../../components/auth/AuthLayout";
import RegisterForm from "../../components/auth/RegisterForm";

const Register = () => {
  return (
    <AuthLayout>
      <div>
        <h1 className="text-3xl font-bold text-white mb-4">Create an account</h1>
        <RegisterForm />
      </div>
    </AuthLayout>
  );
};

export default Register;
