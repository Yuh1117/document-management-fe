import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChangeLanguage } from "./change-language";
import { ModeToggle } from "./theme-toggle";
import { Settings } from "lucide-react";
import { Label } from "@/components/ui/label";

const Setting = () => {
    return (
        <Popover>
            <PopoverTrigger>
                <div className="cursor-pointer p-2 rounded-2xl hover:bg-accent dark:hover:bg-input/50">
                    <Settings />
                </div>
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