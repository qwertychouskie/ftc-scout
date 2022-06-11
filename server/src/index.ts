import "dotenv/config";

import "reflect-metadata";
import {
    ApolloServerPluginLandingPageDisabled,
    ApolloServerPluginLandingPageGraphQLPlayground,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import { buildSchema } from "type-graphql";
import {
    SERVER_PORT,
    IS_DEV,
    WEB_ORIGIN,
    COOKIE_NAME,
    IS_PROD,
    COOKIE_AGE,
    SESSION_SECRET,
    REDIS_PORT,
    REDIS_ORIGIN,
    CURRENT_SEASON,
} from "./constants";
import { resolvers } from "./graphql/resolvers/resolvers";
import { FTCSDataSource } from "./db/data-source";
import session from "express-session";
import connectRedis from "connect-redis";
import Redis from "ioredis";
import { GraphQLContext } from "./graphql/Context";
import { FTCSSession } from "./graphql/Session";
import { loadAllTeamsIntoDatabase } from "./db/load-data/load-all-teams";
import { Team } from "./db/entities/Team";
import { setupApiWatchers } from "./ftc-api/setup-watchers";
import { Season } from "./ftc-api/types/Season";

async function main() {
    await FTCSDataSource.initialize();

    const app = express();

    const RedisStore = connectRedis(session);
    const redisClient = new Redis(REDIS_PORT, REDIS_ORIGIN);

    // Allow requests from our webpage.
    app.use(
        cors({
            origin: WEB_ORIGIN,
            credentials: true,
        })
    );

    // Intilize sessions
    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({
                client: redisClient,
                disableTouch: true,
            }),
            cookie: {
                maxAge: COOKIE_AGE,
                httpOnly: true,
                sameSite: "lax",
                secure: IS_PROD,
            },
            saveUninitialized: false,
            secret: SESSION_SECRET,
            resave: false,
        })
    );

    // Intilize the apollo graphql server.
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers,
            validate: false,
        }),
        context: ({
            req,
            res,
        }: {
            req: Request;
            res: Response;
        }): GraphQLContext => ({
            man: FTCSDataSource.manager,
            req: req as Request & { session: FTCSSession },
            res,
        }),
        plugins: [
            // Give us a nice graphql playground when in dev.
            IS_DEV
                ? ApolloServerPluginLandingPageGraphQLPlayground()
                : ApolloServerPluginLandingPageDisabled(),
        ],
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({
        app,
        cors: false,
    });

    // Start the server
    app.listen(SERVER_PORT, () => {
        console.log(`Server started and listening on localhost:${SERVER_PORT}`);
    });

    setupApiWatchers([Season.FREIGHT_FRENZY]);

    if (process.argv.includes("--clear-teams")) {
        Team.clear();
    }
    if (process.argv.includes("--load-teams")) {
        loadAllTeamsIntoDatabase(CURRENT_SEASON);
    }
}

main();
