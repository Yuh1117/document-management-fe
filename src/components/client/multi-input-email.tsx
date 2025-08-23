import { useState } from "react"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
    onChange?: (emails: string[]) => void,
    emails: string[],
    setEmails: (e: string[]) => void
}

const MultiEmailInput = ({ onChange, emails, setEmails }: Props) => {
    const [value, setValue] = useState("")

    const addEmail = (email: string) => {
        const trimmed = email.trim()
        if (!trimmed) return
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return
        if (emails.includes(trimmed)) return
        const updated = [...emails, trimmed]
        setEmails(updated)
        onChange?.(updated)
    }

    const removeEmail = (email: string) => {
        const updated = emails.filter(e => e !== email)
        setEmails(updated)
        onChange?.(updated)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            addEmail(value)
            setValue("")
        } else if (e.key === "Backspace" && !value && emails.length > 0) {
            removeEmail(emails[emails.length - 1])
        }
    }

    return (
        <div
            className={cn(
                "flex flex-wrap items-center gap-2 rounded-md border px-2 focus-within:ring-2 focus-within:ring-ring"
            )}
        >
            {emails.map((email) => (
                <span
                    key={email}
                    className="flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-sm"
                >
                    {email}
                    <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeEmail(email)}
                    />
                </span>
            ))}
            <Input
                className="flex-1 border-none shadow-none focus-visible:ring-0 p-0"
                placeholder="Nhập email"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>
    )
}

export default MultiEmailInput