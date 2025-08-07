import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLoaderData } from "react-router";

const Home = () => {
    const loaderData = useLoaderData()

    return (
        <div className="bg-muted dark:bg-sidebar flex flex-col min-h-svh rounded-2xl">
            <div className="flex items-center p-1 rounded-2xl">
                <SidebarTrigger />
                <div>Trang chủ</div>
            </div>

            <h1 className="text-center text-2xl">{loaderData.message}</h1>

            <div className="grid grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] gap-4 p-4">
                {Array.from({ length: 20 }).map((_, index) => (
                    <div
                        key={index}
                        className="bg-stone-400 h-12 rounded-2xl"
                    />
                ))}
            </div>
        </div>
    )
}

export default Home;
