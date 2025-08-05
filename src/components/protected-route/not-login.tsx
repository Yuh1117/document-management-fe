import { Link } from 'react-router';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ChangeLanguage } from '../settings/change-language';
import { ModeToggle } from '../settings/theme-toggle';
import { UserRoundCheck } from 'lucide-react';

const NotLogin = () => {
    return (
        <div className="bg-muted flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
            <Card className="w-full md:max-w-sm">
                <CardContent className="text-center">
                    <div className="mb-4 flex justify-center">
                        <UserRoundCheck strokeWidth={1} size={128} />
                    </div>
                    <h2 className="text-xl font-semibold mb-3">
                        Bạn cần đăng nhập để tiếp tục.
                    </h2>
                    <Link to="/login">
                        <Button variant="secondary" className="w-full">
                            Đăng nhập
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

export default NotLogin;