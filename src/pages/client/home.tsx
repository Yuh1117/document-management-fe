import { useLoaderData } from "react-router";

const Home = () => {
    const loaderData = useLoaderData()

    return (
        <div className="bg-muted dark:bg-sidebar flex flex-col min-h-svh rounded-xl p-2">
            <div className="flex items-center rounded-xl p-2">
                <h1 className="text-center text-2xl">{loaderData.message}</h1>
            </div>

        </div>
    )
}

export default Home;
