import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "@/utils/context/authContext.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Breadcrumbs} from "@/components/breadcrumbs.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area.tsx";
import {serverFetch} from "@/utils/fetchs/serverFetch.ts";
import {DialogCreateQuizQuestion} from "@/components/dialogs/dialogCreateQuizQuestion.tsx";
import {Quiz} from "@/utils/interfaces/Quiz.ts";
import {FolderInput} from "lucide-react";
import {GameQuestionItem} from "@/components/gameQuestionItem.tsx";
import {toast} from "@/components/ui/use-toast.tsx";
import {DialogEditQuizName} from "@/components/dialogs/dialogEditQuizName.tsx";

export const EditQuizPage = () => {
    const {draftId} = useParams();
    const navigate = useNavigate();
    const [isQuestionCreated, setIsQuestionCreated] = useState(false);
    const [isQuestionDeleted, setIsQuestionDeleted] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isQuizEdited, setIsQuizEdited] = useState(false);
    const {isAuthenticated, user} = useAuth();
    const [currentQuiz, setCurrentQUiz] = useState<Quiz>();

    useEffect(() => {
        if (!isAuthenticated || !user || !draftId) {
            navigate('/login');
            return;
        }
        if (!user.isAdmin) {
            navigate('/404');
            return;
        }
        serverFetch(`/quizzes/${draftId}`)
            .then(response => response.json())
            .then(data => {
                setCurrentQUiz(data);
                console.log(data);
            })
            .catch(error => {
                console.error('Error fetching game:', error.message);
            });
    }, [draftId, isAuthenticated, isUpdate, user, isQuizEdited, navigate, isQuestionCreated, isQuestionDeleted]);

    async function publishQuiz() {
        try {
            const response = await serverFetch(`/quizzes/${draftId}/change-visibility`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({}),
            });
            const data = await response.json();
            if (response.ok) {
                toast({title: "Quiz published", description: "The quiz was successfully published."});
                navigate("/admin")
            }
            else {
                toast({
                    title: "Error",
                    description: data.Message || "An error occurred.",
                    variant: "destructive",
                });
            }
        } catch (ex: unknown) {
            console.error((ex as Error).message);
        }
    }

    async function dropQuestion(questionId: number) {
        try {
            if (!isAuthenticated || !user) {
                navigate("/login");
                return;
            }
            const response = await serverFetch(`/questions/quiz/${questionId}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: currentQuiz?.id.toString(),
            });

            if (response.ok) {
                setIsQuestionDeleted(!isQuestionDeleted);
                toast({title: "Question Deleted", description: "The question was successfully deleted."});
            } else {
                const responseData = await response.json();
                toast({
                    title: "Error",
                    description: responseData.message || "An error occurred.",
                    variant: "destructive",
                });
            }
        } catch (ex: unknown) {
            toast({
                title: "Error",
                description: (ex as Error).message || "An unexpected error occurred.",
                variant: "destructive"
            });
        }
    }

    return (
        <>
            <Breadcrumbs items={[{path: '/', name: 'Home'}, {path: '/admin', name: 'Drafts'}, {path: `/admin/drafts/${draftId}`, name: "Edit Quiz"}]}/>
            <div className="max-w-[1440px] w-full mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Quiz</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <img src={currentQuiz?.gameCoverImageUrl} alt=""
                                     className="min-w-[50px] aspect-square border rounded-md object-cover me-2 hover:scale-[105%] duration-500 cursor-pointer hover:shadow-2xl"
                                     height="64"
                                     width="64"
                                />
                                <h2>{currentQuiz && currentQuiz.gameName}</h2>
                            </div>
                            <div>
                                {currentQuiz &&
                                    <DialogEditQuizName
                                        currentQuiz={currentQuiz}
                                        setIsEdited={setIsQuizEdited}
                                        isEdited={isQuizEdited}
                                    />
                                }
                                <Button onClick={publishQuiz} size="sm" variant="outline" className="mx-2 h-8 gap-1">
                                    <FolderInput className="h-3.5 w-3.5"/>
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Publish</span>
                                </Button>
                                <DialogCreateQuizQuestion
                                    currentQuizId={draftId!}
                                    setIsQuestionCreated={setIsQuestionCreated}
                                    isQuestionCreated={isQuestionCreated}
                                />
                            </div>
                        </div>

                        <ScrollArea className="mt-5 h-[550px] border rounded-md overflow-y-auto">
                            <div className="flex flex-col p-4">
                                {currentQuiz && currentQuiz.questions && currentQuiz.questions.length > 0 ?
                                    <>
                                        {currentQuiz?.questions.map((item, index) => (
                                            <div key={index} className="mb-2">
                                                <GameQuestionItem
                                                    id={item.id}
                                                    index={index + 1}
                                                    dropItem={dropQuestion}
                                                    question={item.text}
                                                    questionImageUrl={item.quizQuestionImageUrl}
                                                    answers={item.answerOptions}
                                                />
                                            </div>
                                        ))}
                                    </>
                                    :
                                    <>
                                        <div className="flex flex-col items-center justify-center h-[550px] ">
                                            <h1 className="text-xl">There are no questions here yet 😪</h1>
                                        </div>
                                    </>
                                }


                            </div>
                            <ScrollBar orientation="vertical"/>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};