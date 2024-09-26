import {Breadcrumbs} from "@/views/partials/Breadcrumbs.tsx";

const breadcrumbItems = [
    { path: '/', name: 'Home' },
    { path: '/profile', name: 'Profile' },
];

export const ProfilePage = () => {
    return (
        <>
            <h1 className="text-3xl text-center mb-16 mt-16">Profile page</h1>
            <Breadcrumbs items={breadcrumbItems} />
        </>
    )
}