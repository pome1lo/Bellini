import {Breadcrumbs} from "@/components/breadcrumbs.tsx";

const breadcrumbItems = [
    {path: '/', name: 'Home'},
    {path: '/contacts', name: 'Contacts'},
];

export const ContactsPage = () => {
    return (
        <>
            <h1 className="text-3xl text-center mb-16 mt-16">Contacts page</h1>
            <Breadcrumbs items={breadcrumbItems}/>
        </>
    )
}