import { authInfoState, dummyAuthData } from '@/atoms/authInfoState';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';

const useAuth = () => {
  const router = useRouter();
  const [authInfo, setAuthInfo] = useAtom(authInfoState);

  const handleLogin = () => {
    setAuthInfo(dummyAuthData);
    router.replace('/');
  };

  const checkAuth = () => {
    if (!authInfo) router.replace('/landing');
  };

  return { authInfo, checkAuth, handleLogin };
};

export default useAuth;
