import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { SearchCheck, SearchIcon, SlidersHorizontal, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"

const SearchBar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [searchHistory, setSearchHistory] = useState<{ label: string }[]>([])

    const saveToHistory = (value: string) => {
        if (!value.trim()) return

        const exists = searchHistory.some(item => item.label.toLowerCase() === value.toLowerCase())
        if (exists) return

        const updatedHistory = [{ label: value }, ...searchHistory].slice(0, 5)
        setSearchHistory(updatedHistory)
        localStorage.setItem("search-history", JSON.stringify(updatedHistory))
    }

    const deleteHistoryItem = (indexToRemove: number) => {
        const updated = searchHistory.filter((_, i) => i !== indexToRemove)
        setSearchHistory(updated)
        localStorage.setItem("search-history", JSON.stringify(updated))
    }

    const handleClick = () => {
        saveToHistory(searchValue)
        setIsOpen(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            saveToHistory(searchValue)
            setIsOpen(false)
            e.currentTarget.blur()
        }
    }

    useEffect(() => {
        const stored = localStorage.getItem("search-history")
        if (stored) {
            setSearchHistory(JSON.parse(stored))
        }
    }, [])

    const filteredHistory = searchValue.trim()
        ? searchHistory.filter(item => item.label.toLowerCase().includes(searchValue.toLowerCase())) : searchHistory

    return (
        <div className="relative w-full max-w-lg">
            <div className={cn("flex items-center rounded-xl border bg-popover px-3 text-popover-foreground", isOpen && "rounded-b-none")}>
                <SearchIcon className="size-4 opacity-50" />
                <Input
                    className="border-none focus-visible:ring-[0px] dark:bg-popover"
                    type="text"
                    placeholder="Tìm kiếm"
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                {isOpen && <SearchCheck className="size-4 cursor-pointer" onClick={handleClick} />}
            </div>

            {isOpen && (
                <div className="absolute top-full z-10 w-full rounded-b-xl border border-t-0 bg-popover shadow-lg">
                    <div className="p-1">
                        <Label className="m-2 text-xs text-muted-foreground">Lịch sử tìm kiếm</Label>
                        <div>
                            {filteredHistory.length > 0 ? (
                                filteredHistory.map((item, index) => (
                                    <div
                                        key={index}
                                        className="group flex items-center justify-between gap-2 px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-xl cursor-default"
                                    >
                                        <div className="flex items-center gap-2">
                                            <SearchIcon className="size-4 opacity-50" />
                                            <span>{item.label}</span>
                                        </div>
                                        <X
                                            className="size-3 opacity-0 group-hover:opacity-60 hover:text-destructive hover:opacity-100 cursor-pointer"
                                            onMouseDown={(e) => {
                                                e.preventDefault()
                                                deleteHistoryItem(index)
                                            }}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="px-2 py-2 text-xs text-muted-foreground italic">Không có lịch sử tìm kiếm</div>
                            )}
                        </div>

                    </div>

                    <div className="h-px bg-border" />

                    <div className="p-1">
                        <Label className="m-2 text-xs text-muted-foreground">Nâng cao</Label>
                        <HoverCard >
                            <HoverCardTrigger>
                                <Button variant="link" className="cursor-default">
                                    <SlidersHorizontal className="size-4 opacity-60" />
                                    Tìm kiếm nâng cao
                                </Button>
                            </HoverCardTrigger>
                            <HoverCardContent>
                                Đây là tìm kiếm nâng cao.
                            </HoverCardContent>
                        </HoverCard>
                    </div>
                </div>
            )
            }
        </div >
    )
}
export default SearchBar;