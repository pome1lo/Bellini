import {Breadcrumbs} from "@/components/breadcrumbs.tsx";

const breadcrumbItems = [
    {path: '/', name: 'Главная'},
    {path: '/contacts', name: 'Контакты'},
];

export const ContactsPage = () => {
    return (
        <>
            <h1 className="text-3xl text-center mb-16 mt-16">Страница контактов</h1>
            <Breadcrumbs items={breadcrumbItems}/>
        </>
    )
}