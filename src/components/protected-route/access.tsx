import { useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';

type Props = {
    children: React.ReactNode;
    permission: { method: string, apiPath: string, module: string }
    hideChildren?: boolean;
}

const Access = ({ children, permission, hideChildren = false }: Props) => {
    const [allow, setAllow] = useState<boolean>(false);
    const permissions = useAppSelector(state => state?.users?.user?.role.permissions);

    useEffect(() => {
        if (permissions?.length) {
            const check = permissions.find(item =>
                item.apiPath === permission.apiPath
                && item.method === permission.method
                && item.module === permission.module
            )
            if (check) {
                setAllow(true)
            } else
                setAllow(false);
        }
    }, [permissions])

    return (
        <>
            {allow === true || import.meta.env.VITE_NO_ACCESS === 'false' ?
                <>{children}</>
                :
                <>
                    {hideChildren === false ?
                        <>
                            <Card className="w-full md:max-w-sm ">
                                <CardContent className="text-center">
                                    <div className="mb-4 flex justify-center">
                                        <ShieldAlert strokeWidth={1} size={128} />
                                    </div>
                                    <h2 className="text-xl font-semibold mb-3">
                                        Bạn không có quyền truy cập!
                                    </h2>
                                </CardContent>
                            </Card>
                        </>
                        :
                        <>
                            {/* render nothing */}
                        </>
                    }
                </>
            }
        </>

    )
}

export default Access;