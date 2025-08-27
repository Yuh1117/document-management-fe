import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { SearchCheck, SearchIcon, SlidersHorizontal, Underline, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const SearchBar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [searchHistory, setSearchHistory] = useState<{ label: string }[]>([])
    const nav = useNavigate()
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [kw, setKw] = useState<string>("")
    const [kwType, setKwType] = useState<string>("exact")
    const [type, setType] = useState("any")
    const [size, setSize] = useState<number>()
    const [sizeType, setSizeType] = useState("minSize")

    const handleSearch = (value: string) => {
        const trimmed = value.trim()
        if (!trimmed) return

        const exists = searchHistory.some(item => item.label.toLowerCase() === trimmed.toLowerCase())
        if (!exists) {
            const updatedHistory = [{ label: trimmed }, ...searchHistory].slice(0, 5)
            setSearchHistory(updatedHistory)
            localStorage.setItem("search-history", JSON.stringify(updatedHistory))
        }

        const query = new URLSearchParams()
        query.set("kw", trimmed)

        nav(`/search?${query.toString()}`)
        setIsOpen(false)
    }

    const handleAdvancedSearch = () => {
        const query = new URLSearchParams()

        const trimmedKw = kw.trim()
        if (trimmedKw) {
            query.set("kw", trimmedKw)
            query.set("kwType", kwType)
        }
        if (type !== "any") {
            query.set("type", type)
        }
        if (size) {
            query.set("size", size.toString())
            query.set("sizeType", sizeType)
        }

        nav(`/advanced-search/?${query.toString()}`)
        setSearchValue("")
        setShowAdvanced(false)
    }

    const deleteHistoryItem = (indexToRemove: number) => {
        const updated = searchHistory.filter((_, i) => i !== indexToRemove)
        setSearchHistory(updated)
        localStorage.setItem("search-history", JSON.stringify(updated))
    }

    const handleClick = () => {
        handleSearch(searchValue)
        setIsOpen(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch(searchValue)
            setIsOpen(false)
            e.currentTarget.blur()
        }
    }

    const reset = () => {
        setKw("")
        setKwType("exact")
        setType("any")
        setSize(undefined)
        setSizeType("minSize")
    }

    useEffect(() => {
        const stored = localStorage.getItem("search-history")
        if (stored) {
            setSearchHistory(JSON.parse(stored))
        }
    }, [showAdvanced])

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
                                        onClick={() => {
                                            setSearchValue(item.label)
                                            handleSearch(item.label)
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <SearchIcon className="size-4 opacity-50" />
                                            <span>{item.label}</span>
                                        </div>
                                        <X
                                            className="size-4 opacity-0 group-hover:opacity-60 hover:text-destructive hover:opacity-100 cursor-pointer"
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={(e) => {
                                                e.stopPropagation()
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
                                <Button variant="ghost" className="rounded-xl"
                                    onClick={() => {
                                        setShowAdvanced(true)
                                    }}>
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
            )}

            <Dialog open={showAdvanced} onOpenChange={setShowAdvanced}>
                <DialogContent aria-describedby={undefined} className="top-[30%] left-[55%] w-full md:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Tìm kiếm nâng cao</DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-4 gap-4 p-1">
                        <Label className="col-span-1">Loại tài liệu</Label>
                        <div className="col-span-3">
                            <Select value={type} onValueChange={(s: string) => setType(s)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn loại tài liệu" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="any">Bất kỳ</SelectItem>
                                    <SelectItem value="pdf">PDF</SelectItem>
                                    <SelectItem value="word">DOC</SelectItem>
                                    <SelectItem value="image">Hình ảnh</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Label className="col-span-1">Dung lượng file</Label>
                        <div className="col-span-3 flex items-center gap-4">
                            <Select value={sizeType} onValueChange={(s: string) => setSizeType(s)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="minSize">Lớn hơn</SelectItem>
                                    <SelectItem value="maxSize">Nhỏ hơn</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input type="number" placeholder="MB" className="w-32" min={0}
                                value={size ?? ""} onChange={(e) => setSize(parseFloat(e.target.value))} />
                        </div>

                        <Label className="col-span-4">Từ khóa</Label>
                        <div className="col-span-1">
                            <Select value={kwType} onValueChange={(s: string) => setKwType(s)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="exact">Chính xác</SelectItem>
                                    <SelectItem value="similar">Gần giống</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-3">
                            <Input placeholder="Nhập từ khóa"
                                value={kw}
                                onChange={(e) => setKw(e.target.value)}
                            />
                        </div>
                    </div>


                    <DialogFooter>
                        <Button variant="outline" onClick={reset}>
                            Đặt lại
                        </Button>
                        <Button onClick={handleAdvancedSearch}>Tìm kiếm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div >
    )
}
export default SearchBar;