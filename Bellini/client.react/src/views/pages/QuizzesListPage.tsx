import {Breadcrumbs} from "@/views/partials/Breadcrumbs.tsx";

const breadcrumbItems = [
    {path: '/', name: 'Home'},
    {path: '/quizzes', name: 'Quizzes'},
];
 
export const QuizzesListPage = () => {
    return (
        <>

            <Breadcrumbs items={breadcrumbItems}/>
            quizzes list page
        </>
    );
}