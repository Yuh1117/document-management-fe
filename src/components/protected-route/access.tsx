import { Card, CardContent } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';
import { Spinner } from '../ui/spinner';
import { useAppSelector } from '@/redux/hooks';

type Props = {
    children: React.ReactNode;
    permission: { method: string, apiPath: string, module: string }
    hideChildren?: boolean;
}

const Access = ({ children, permission, hideChildren = false }: Props) => {
    const { permissionsMap, loading } = useAppSelector((state) => state.permissions);
    const key = `${permission.apiPath}|${permission.method.toUpperCase()}`;
    const allow = permissionsMap[key] === true;

    if (loading) return <Spinner />;

    return (
        <>
            {allow === true || import.meta.env.VITE_NO_ACCESS === 'false' ?
                <>{children}</>
                :
                <>
                    {hideChildren === false ?
                        <div className="flex flex-col items-center justify-center">
                            <Card className="w-full md:max-w-sm">
                                <CardContent className="text-center">
                                    <div className="mb-4 flex justify-center">
                                        <ShieldAlert strokeWidth={1} size={128} />
                                    </div>
                                    <h2 className="text-xl font-semibold mb-3">
                                        Bạn không có quyền truy cập!
                                    </h2>
                                </CardContent>
                            </Card>
                        </div>
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