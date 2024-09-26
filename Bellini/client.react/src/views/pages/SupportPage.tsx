import {Breadcrumbs} from "@/views/partials/Breadcrumbs.tsx";

const breadcrumbItems = [
    { path: '/', name: 'Home' },
    { path: '/support', name: 'Support' },
];

export const SupportPage = () => {
    return (
        <>
            <h1 className="text-3xl text-center mb-16 mt-16">Support page</h1>
            <Breadcrumbs items={breadcrumbItems} />
        </>
    )
}