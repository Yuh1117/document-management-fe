import { SidebarTrigger } from "@/components/ui/sidebar";

const Home = () => {
    return (
        <div className="bg-muted flex flex-col min-h-svh p-1 rounded-l-2xl">
            <SidebarTrigger />
            <div className="text-center">Home</div>
        </div>
    )
}

export default Home;
