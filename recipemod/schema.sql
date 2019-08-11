DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS recipes;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username text NOT NULL,
    password text NOT NULL
);

CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    description text,
    author integer REFERENCES users(id),
    created timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    yield text,
    ingredients jsonb,
    instructions jsonb,
    times jsonb,
    category jsonb,
    cuisine jsonb,
    keywords jsonb,
    ratings jsonb,
    video jsonb,
    reviews jsonb
);