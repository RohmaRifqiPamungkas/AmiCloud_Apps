import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = (WrappedComponent) => {
    const Wrapper = (props) => {
        const { user, isLoading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            console.log(isLoading, user)
            if (!isLoading && !user) {
                router.push('/login');
            }

        }, [user, isLoading, router]);

        return <WrappedComponent {...props} />;
    };

    return Wrapper;
};

export default withAuth;