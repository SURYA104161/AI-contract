import AuthLayout from "../../components/auth/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";

const Login = () => {
  return (
    <AuthLayout>
      <div>
        <h1 className="text-3xl font-bold text-white mb-4">Welcome back</h1>
        <LoginForm />
      </div>
    </AuthLayout>
  );
};

export default Login;
