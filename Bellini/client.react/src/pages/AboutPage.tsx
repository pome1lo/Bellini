import { Breadcrumbs } from "@/components/breadcrumbs.tsx";
import { Separator } from "@/components/ui/separator.tsx";

const breadcrumbItems = [
    { path: '/', name: 'Home' },
    { path: '/about', name: 'About' },
];

export const AboutPage = () => {
    return (
        <>
            <Breadcrumbs items={breadcrumbItems} />
            <div className="p-4 space-y-6 max-w-xl flex m-auto flex-col items-center">
                <h1 className="text-2xl font-bold mb-4">🧠 Платформа для интеллектуальных игр с функциями социальных сетей (PSIG)</h1>
                <p className="mb-6">
                    Добро пожаловать в <strong>PSSIG</strong> — веб-приложение, предназначенное для организации интеллектуальных игр и управления ими с интегрированными элементами социальных сетей, предлагающее игрокам увлекательные
                    опыт, богатая статистика и динамичное взаимодействие. Эта платформа предоставляет пользователям возможность создавать игры, участвовать в них и управлять ими, одновременно создавая динамичное сообщество
                    с помощью профилей игроков, взаимодействий в режиме реального времени и игровой аналитики.
                </p>


                <p className="text-xl font-semibold mt-6">📜 Table of Contents</p>
                <ul className="list-disc ml-5 space-y-2 text-left">
                    <li>Особенности</li>
                    <li>Архитектура</li>
                    <li>Технологии</li>
                    <li>Установка</li>
                    <li>Использование</li>
                    <li>Документация по API</li>
                    <li>Планы на будущее</li>
                    <li>Лицензия</li>
                </ul>

                <Separator className="my-6"/>

                <h2 className="text-xl font-semibold">🚀 Features</h2>
                <ul className="list-disc ml-5 space-y-2">
                    <li>Регистрация и аутентификация пользователей: Защищенная система управления пользователями с доступом на основе ролей.</li>
                    <li>Управление профилями: Настраиваемые профили пользователей со статистикой и отслеживанием активности.</li>
                    <li>Создание игр и управление ими: Организация и проведение интеллектуальных игр, приглашение участников и управление результатами.</li>
                    <li>Статистика в реальном времени: Подробный анализ игр с персонализированными отчетами и отслеживанием результатов.</li>
                    <li>Функции социальных сетей: Комментарии, обсуждения и взаимодействие с другими игроками во время и после игр.</li>
                    <li>История игр и таблицы лидеров: Отслеживание прогресса пользователей и глобальных рейтингов.</li>
                    <li>Масштабируемые микросервисы: Оптимизированы для обеспечения высокой производительности и масштабируемости для поддержки большого числа пользователей и игр.</li>
                </ul>

                <Separator className="my-6"/>

                <h2 className="text-xl font-semibold">🏗️ Architecture</h2>
                <p>PSSIG utilizes a three-layer architecture to ensure scalability, maintainability, and flexibility:</p>
                <ul className="list-decimal ml-5 space-y-2">
                    <li>
                        <strong>Data Access Layer (DAL):</strong> Uses Entity Framework for data modeling and MS SQL Server for persistent storage.
                    </li>
                    <li>
                        <strong>Business Logic Layer (BLL):</strong> Contains core services such as game management, user profiles, statistics, and notifications. Implements caching using Redis to
                        optimize performance.
                    </li>
                    <li>
                        <strong>Presentation Layer:</strong> RESTful API built with ASP.NET Core Web API. Frontend developed with React TypeScript and Shadcn UI.
                    </li>
                </ul>

                <Separator className="my-6"/>

                <h2 className="text-xl font-semibold">💻 Technologies</h2>
                <ul className="list-disc ml-5 space-y-2">
                    <li><strong>Backend:</strong> ASP.NET Core Web API, Entity Framework Core, Redis (caching), MS SQL Server, API Gateway (nginx)</li>
                    <li><strong>Frontend:</strong> React (TypeScript), Shadcn UI, jQuery (for Ajax requests)</li>
                    <li><strong>Communication:</strong> WebSocket (for real-time interactions)</li>
                    <li><strong>Tools:</strong> Docker (for containerization), JetBrains Rider (IDE), Postman (API testing)</li>
                </ul>

                <Separator className="my-6"/>

                <h2 className="text-xl font-semibold">🛠️ Installation</h2>
                <h3 className="text-lg font-semibold mt-4">Prerequisites</h3>
                <ul className="list-disc ml-5 space-y-2">
                    <li>.NET 7.0 SDK</li>
                    <li>Node.js & npm</li>
                    <li>Сервер MS SQL Server</li>
                    <li>Docker</li>
                </ul>

                <h3 className="text-lg font-semibold mt-4">Steps</h3>
                <ol className="list-decimal ml-5 space-y-2">
                    <li>Clone the repository:<code className="text-green-700 p-2 rounded">git clone https://github.com/your-username/pssig.git</code></li>
                    <li>Navigate to the backend folder and install dependencies:<code className="text-green-700 p-2 rounded">cd backend<br/>dotnet restore</code></li>
                    <li>Navigate to the frontend folder and install dependencies:<code className="text-green-700 p-2 rounded">cd ../frontend<br/>npm install</code></li>
                    <li>Setup the database by configuring your <code>appsettings.json</code> with the MS SQL Server connection string and running the migrations:<code
                        className="text-green-700 p-2 rounded">dotnet ef database update</code></li>
                    <li>Run the backend:<code className="text-green-700 p-2 rounded">dotnet run</code></li>
                    <li>Run the frontend:<code className="text-green-700 p-2 rounded">npm start</code></li>
                    <li>Access the app: Open <a href="http://localhost:5173">http://localhost:5173</a> in your browser.</li>
                </ol>

                <Separator className="my-6"/>

                <h2 className="text-xl font-semibold">📖 Usage</h2>
                <ul className="list-disc ml-5 space-y-2">
                    <li><strong>Admin Panel:</strong> Manage users, games, and global settings.</li>
                    <li><strong>Player Dashboard:</strong> View and join available games, check personal statistics, and interact with other players.</li>
                    <li><strong>Create a Game:</strong> Organize a new game, set the rules, and invite players to participate.</li>
                    <li><strong>Leaderboard:</strong> View global rankings and personal achievements.</li>
                </ul>

                <Separator className="my-6"/>

                <h2 className="text-xl font-semibold">📚 Документация по API</h2>
                <p>Все конечные точки документируются с помощью Swagger, доступного по адресу <a href="http://localhost:5000/swagger">http://localhost:5000/swagger </a> как только серверная часть будет запущена.</p>

                <Separator className="my-6"/>

                <h2 className="text-xl font-semibold">🔮 Future Plans</h2>
                <ul className="list-disc ml-5 space-y-2">
                    <li>Мобильное приложение: Нативное мобильное приложение для iOS и Android, использующее Flutter.</li>
                    <li>Варианты игр: Знакомьте с новыми типами и жанрами игр.</li>
                    <li>Расширенная аналитика: Предоставляйте более глубокую информацию с помощью машинного обучения для получения персонализированных рекомендаций по производительности.</li>
                    <li>Возможности монетизации: Интегрируйте премиум-функции для улучшения игрового процесса.</li>
                </ul>

                <Separator className="my-6"/>

                <h2 className="text-xl font-semibold">📝 Лицензия</h2>
                <p>Этот проект лицензирован по лицензии MIT - подробности смотрите в файле ЛИЦЕНЗИИ.</p>

                <Separator className="my-6"/>

                <h2 className="text-xl font-bold text-center">Благодарим вас за использование PSIG!</h2>
                <p className="text-center">Веселой игры, и пусть начинаются интеллектуальные испытания! ✨</p>


                <iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A8f2362ce665f890e508197efa70946e31cfd20faff019fefa418995197e9b100&amp;source=constructor" width="544" height="329"></iframe>
            </div>
        </>
    );
};
