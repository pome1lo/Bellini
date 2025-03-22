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
                <h1 className="text-2xl font-bold mb-4">🧠 Intellectual Games Platform with Social Network Features (PSSIG)</h1>
                <p className="mb-6">
                    Welcome to <strong>PSSIG</strong> — a web application designed to organize and manage intellectual games with integrated social network elements, offering players engaging
                    experiences, rich statistics, and dynamic interactions. This platform provides users with the ability to create, participate in, and manage games while fostering a vibrant
                    community through player profiles, real-time interactions, and game analytics.
                </p>


                <p className="text-xl font-semibold mt-6">📜 Table of Contents</p>
                <ul className="list-disc ml-5 space-y-2 text-left">
                    <li>Features</li>
                    <li>Architecture</li>
                    <li>Technologies</li>
                    <li>Installation</li>
                    <li>Usage</li>
                    <li>API Documentation</li>
                    <li>Future Plans</li>
                    <li>License</li>
                </ul>

                <Separator className="my-6"/>

                <h2 className="text-xl font-semibold">🚀 Features</h2>
                <ul className="list-disc ml-5 space-y-2">
                    <li>User Registration & Authentication: Secure user management system with role-based access.</li>
                    <li>Profile Management: Customizable user profiles with statistics and activity tracking.</li>
                    <li>Game Creation & Management: Organize and run intellectual games, invite participants, and manage results.</li>
                    <li>Real-time Statistics: In-depth analytics of games with personalized reports and performance tracking.</li>
                    <li>Social Network Features: Comments, discussions, and interaction with other players during and after games.</li>
                    <li>Game History & Leaderboards: Track user progress and global rankings.</li>
                    <li>Scalable Microservices: Optimized for high-performance and scalable to support large numbers of users and games.</li>
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
                    <li>MS SQL Server</li>
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

                <h2 className="text-xl font-semibold">📚 API Documentation</h2>
                <p>All endpoints are documented using Swagger, accessible at <a href="http://localhost:5000/swagger">http://localhost:5000/swagger</a> once the backend is running.</p>

                <Separator className="my-6"/>

                <h2 className="text-xl font-semibold">🔮 Future Plans</h2>
                <ul className="list-disc ml-5 space-y-2">
                    <li>Mobile App: Native mobile application for iOS and Android using Flutter.</li>
                    <li>Game Variations: Introduce new game types and genres.</li>
                    <li>Advanced Analytics: Provide deeper insights using machine learning for personalized performance recommendations.</li>
                    <li>Monetization Features: Integrate premium features for enhanced game experiences.</li>
                </ul>

                <Separator className="my-6"/>

                <h2 className="text-xl font-semibold">📝 License</h2>
                <p>This project is licensed under the MIT License - see the LICENSE file for details.</p>

                <Separator className="my-6"/>

                <h2 className="text-xl font-bold text-center">Thank you for using PSSIG!</h2>
                <p className="text-center">Happy gaming and let the intellectual challenges begin! ✨</p>


                <iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A8f2362ce665f890e508197efa70946e31cfd20faff019fefa418995197e9b100&amp;source=constructor" width="544" height="329"></iframe>
            </div>
        </>
    );
};
