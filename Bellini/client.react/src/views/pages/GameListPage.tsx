import {Breadcrumbs} from "@/views/partials/Breadcrumbs.tsx";

const breadcrumbItems = [
    { path: '/', name: 'Home' },
    { path: '/games', name: 'Games' },
];

export const GameListPage = () => {
    return (
        <>
            <h1 className="text-3xl text-center mb-16 mt-16">Games list page</h1>
            <Breadcrumbs items={breadcrumbItems}/>
        </>
    )
}