import { Link } from 'react-router';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ChangeLanguage } from '../settings/ChangeLanguage';
import { ModeToggle } from '../settings/ThemeToggle';
import { ShieldAlert } from 'lucide-react';

const NotPermitted = () => {
    return (
        <div className="bg-muted flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
            <Card className="w-full md:max-w-sm ">
                <CardContent className="text-center">
                    <div className="mb-4 flex justify-center">
                        <ShieldAlert strokeWidth={1} size={128}/>
                    </div>
                    <h2 className="text-xl font-semibold mb-3">
                        Bạn không có quyền truy cập trang này!
                    </h2>
                    <Link to="/">
                        <Button variant="secondary" className="w-full">
                            Quay về trang chủ
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            <div className="flex p-3 gap-2">
                <ChangeLanguage />
                <ModeToggle />
            </div>
        </div>
    );
};

export default NotPermitted;