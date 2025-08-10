import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    const handleChangeTheme = (theme: "light" | "dark" | "system") => {
        setTheme(theme)
    }

    return (
        <Select value={theme} onValueChange={handleChangeTheme}>
            <SelectTrigger className="bg-white">
                <SelectValue>
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 text-black-900" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 text-black-900" />
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}