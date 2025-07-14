import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChangeLanguage } from "./ChangeLanguage";
import { ModeToggle } from "./ThemeToggle";
import { Settings } from "lucide-react";

const Setting = () => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                    <Settings strokeWidth={2} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto max-w-sm max-h-60 overflow-auto">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="leading-none font-medium">Cài đặt</h4>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-2">
                            <Label>Ngôn ngữ</Label>
                            <ChangeLanguage />
                        </div>
                        <div className="grid grid-cols-2">
                            <Label>Giao diện</Label>
                            <ModeToggle />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default Setting;