import {Breadcrumbs} from "@/views/partials/Breadcrumbs.tsx";

const breadcrumbItems = [
    { path: '/', name: 'Home' },
    { path: '/about', name: 'About' },
];

export const AboutPage = () => {
    return (
        <>
            <h1 className="text-3xl text-center mb-16 mt-16">About page</h1>
            <Breadcrumbs items={breadcrumbItems} />
        </>
    )
}