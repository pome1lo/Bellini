import { Breadcrumbs } from "@/views/partials/Breadcrumbs.tsx";
import { Separator } from "@/components/ui/separator";

const breadcrumbItems = [
    { path: '/', name: 'Home' },
    { path: '/about', name: 'About' },
];

export const AboutPage = () => {
    return (
        <>
            <Breadcrumbs items={breadcrumbItems} />
            <div className="p-4 space-y-6 max-w-xl flex m-auto flex-col items-center">
                <h1 data-aos="zoom-out" data-aos-duration="1000" className="text-2xl font-bold mb-4">🧠 Intellectual Games Platform with Social Network Features (PSSIG)</h1>
                <p data-aos="zoom-out" data-aos-duration="1000" className="mb-6">
                    Welcome to <strong>PSSIG</strong> — a web application designed to organize and manage intellectual games with integrated social network elements, offering players engaging experiences, rich statistics, and dynamic interactions. This platform provides users with the ability to create, participate in, and manage games while fostering a vibrant community through player profiles, real-time interactions, and game analytics.
                </p>

                <p data-aos="zoom-out" data-aos-duration="1000" className="text-xl font-semibold mt-6">📜 Table of Contents</p>
                <ul className="list-disc ml-5 space-y-2 text-left">
                    <li data-aos="zoom-out" data-aos-duration="1000">Features</li>
                    <li data-aos="zoom-out" data-aos-duration="1000">Architecture</li>
                    <li data-aos="zoom-out" data-aos-duration="1000">Technologies</li>
                    <li data-aos="zoom-out" data-aos-duration="1000">Installation</li>
                    <li data-aos="zoom-out" data-aos-duration="1000">Usage</li>
                    <li data-aos="zoom-out" data-aos-duration="1000">API Documentation</li>
                    <li data-aos="zoom-out" data-aos-duration="1000">Future Plans</li>
                    <li data-aos="zoom-out" data-aos-duration="1000">License</li>
                </ul>

                <Separator className="my-6" />

                <h2 data-aos="zoom-out" data-aos-duration="1000" className="text-xl font-semibold">🚀 Features</h2>
                <ul className="list-disc ml-5 space-y-2">
                    <li data-aos="zoom-out" data-aos-duration="1000">User Registration & Authentication: Secure user management system with role-based access.</li>
                    <li data-aos="zoom-out" data-aos-duration="1000">Profile Management: Customizable user profiles with statistics and activity tracking.</li>
                    <li data-aos="zoom-out" data-aos-duration="1000">Game Creation & Management: Organize and run intellectual games, invite participants, and manage results.</li>
                    <li data-aos="zoom-out" data-aos-duration="1000">Real-time Statistics: In-depth analytics of games with personalized reports and performance tracking.</li>
                    <li data-aos="zoom-out" data-aos-duration="1000">Social Network Features: Comments, discussions, and interaction with other players during and after games.</li>
                    <li data-aos="zoom-out" data-aos-duration="1000">Game History & Leaderboards: Track user progress and global rankings.</li>
                    <li data-aos="zoom-out" data-aos-duration="1000">Scalable Microservices: Optimized for high-performance and scalable to support large numbers of users and games.</li>
                </ul>

                <Separator className="my-6" />

                <h2 data-aos="zoom-out" data-aos-duration="1000"  className="text-xl font-semibold">🏗️ Architecture</h2>
                <p data-aos="zoom-out" data-aos-duration="1000">PSSIG utilizes a three-layer architecture to ensure scalability, maintainability, and flexibility:</p>
                <ul className="list-decimal ml-5 space-y-2">
                    <li data-aos="zoom-out" data-aos-duration="1000">
                        <strong>Data Access Layer (DAL):</strong> Uses Entity Framework for data modeling and MS SQL Server for persistent storage.
                    </li>
                    <li data-aos="zoom-out" data-aos-duration="1000">
                        <strong>Business Logic Layer (BLL):</strong> Contains core services such as game management, user profiles, statistics, and notifications. Implements caching using Redis to optimize performance.
                    </li>
                    <li data-aos="zoom-out" data-aos-duration="1000">
                        <strong>Presentation Layer:</strong> RESTful API built with ASP.NET Core Web API. Frontend developed with React TypeScript and Shadcn UI.
                    </li>
                </ul>

                <Separator className="my-6" />

                <h2 data-aos="zoom-out" data-aos-duration="1000" className="text-xl font-semibold">💻 Technologies</h2>
                <ul className="list-disc ml-5 space-y-2">
                    <li data-aos="zoom-out" data-aos-duration="1000"><strong>Backend:</strong> ASP.NET Core Web API, Entity Framework Core, Redis (caching), MS SQL Server, API Gateway (nginx)</li>
                    <li data-aos="zoom-out" data-aos-duration="1000"><strong>Frontend:</strong> React (TypeScript), Shadcn UI, jQuery (for Ajax requests)</li>
                    <li data-aos="zoom-out" data-aos-duration="1000"><strong>Communication:</strong> WebSocket (for real-time interactions)</li>
                    <li data-aos="zoom-out" data-aos-duration="1000"><strong>Tools:</strong> Docker (for containerization), JetBrains Rider (IDE), Postman (API testing)</li>
                </ul>

                <Separator className="my-6" />

                <h2 data-aos="zoom-out" data-aos-duration="1000" className="text-xl font-semibold">🛠️ Installation</h2>
                <h3 data-aos="zoom-out" data-aos-duration="1000" className="text-lg font-semibold mt-4">Prerequisites</h3>
                <ul className="list-disc ml-5 space-y-2">
                    <li data-aos="zoom-out" data-aos-duration="1000">.NET 7.0 SDK</li>
                    <li data-aos="zoom-out" data-aos-duration="1000">Node.js & npm</li>
                    <li data-aos="zoom-out" data-aos-duration="1000">MS SQL Server</li>
                    <li data-aos="zoom-out" data-aos-duration="1000">Docker</li>
                </ul>

                <h3 data-aos="zoom-out" data-aos-duration="1000"  className="text-lg font-semibold mt-4">Steps</h3>
                <ol className="list-decimal ml-5 space-y-2">
                    <li data-aos="zoom-out" data-aos-duration="1000">Clone the repository:<code className="text-green-700 p-2 rounded">git clone https://github.com/your-username/pssig.git</code></li>
                    <li data-aos="zoom-out" data-aos-duration="1000">Navigate to the backend folder and install dependencies:<code className="text-green-700 p-2 rounded">cd backend<br/>dotnet restore</code></li>
                    <li data-aos="zoom-out" data-aos-duration="1000">Navigate to the frontend folder and install dependencies:<code className="text-green-700 p-2 rounded">cd ../frontend<br/>npm install</code></li>
                    <li data-aos="zoom-out" data-aos-duration="1000">Setup the database by configuring your <code>appsettings.json</code> with the MS SQL Server connection string and running the migrations:<code className="text-green-700 p-2 rounded">dotnet ef database update</code></li>
                    <li data-aos="zoom-out" data-aos-duration="1000">Run the backend:<code className="text-green-700 p-2 rounded">dotnet run</code></li>
                    <li data-aos="zoom-out" data-aos-duration="1000">Run the frontend:<code className="text-green-700 p-2 rounded">npm start</code></li>
                    <li data-aos="zoom-out" data-aos-duration="1000">Access the app: Open <a href="http://localhost:5173">http://localhost:5173</a> in your browser.</li>
                </ol>

                <Separator className="my-6" />

                <h2 data-aos="zoom-out" data-aos-duration="1000" className="text-xl font-semibold">📖 Usage</h2>
                <ul className="list-disc ml-5 space-y-2">
                    <li data-aos="zoom-out" data-aos-duration="1000"><strong>Admin Panel:</strong> Manage users, games, and global settings.</li>
                    <li data-aos="zoom-out" data-aos-duration="1000"><strong>Player Dashboard:</strong> View and join available games, check personal statistics, and interact with other players.</li>
                    <li data-aos="zoom-out" data-aos-duration="1000"><strong>Create a Game:</strong> Organize a new game, set the rules, and invite players to participate.</li>
                    <li data-aos="zoom-out" data-aos-duration="1000"><strong>Leaderboard:</strong> View global rankings and personal achievements.</li>
                </ul>

                <Separator className="my-6" />

                <h2 data-aos="zoom-out" data-aos-duration="1000" className="text-xl font-semibold">📚 API Documentation</h2>
                <p data-aos="zoom-out" data-aos-duration="1000">All endpoints are documented using Swagger, accessible at <a href="http://localhost:5000/swagger">http://localhost:5000/swagger</a> once the backend is running.</p>

                <Separator className="my-6" />

                <h2  data-aos="zoom-out" data-aos-duration="1000" className="text-xl font-semibold">🔮 Future Plans</h2>
                <ul className="list-disc ml-5 space-y-2">
                    <li data-aos="zoom-out" data-aos-duration="1000">Mobile App: Native mobile application for iOS and Android using Flutter.</li>
                    <li data-aos="zoom-out" data-aos-duration="1000">Game Variations: Introduce new game types and genres.</li>
                    <li data-aos="zoom-out" data-aos-duration="1000">Advanced Analytics: Provide deeper insights using machine learning for personalized performance recommendations.</li>
                    <li data-aos="zoom-out" data-aos-duration="1000">Monetization Features: Integrate premium features for enhanced game experiences.</li>
                </ul>

                <Separator className="my-6" />

                <h2 data-aos="zoom-out" data-aos-duration="1000"  className="text-xl font-semibold">📝 License</h2>
                <p data-aos="zoom-out" data-aos-duration="1000">This project is licensed under the MIT License - see the LICENSE file for details.</p>

                <Separator className="my-6" />

                <h2 data-aos="zoom-out" data-aos-duration="1000" className="text-xl font-bold text-center">Thank you for using PSSIG!</h2>
                <p data-aos="zoom-out" data-aos-duration="1000" className="text-center">Happy gaming and let the intellectual challenges begin! ✨</p>
            </div>
        </>
    );
};
