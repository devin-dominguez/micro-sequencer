# Schema Information

## users
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
username        | string    | not null, indexed, unique
password_digest | string    | not null
session_token   | string    | not null, indexed, unique

## compositions
column name | data type | details
------------|-----------|-----------------------
id          | integer   | not null, primary key
title       | string    | not null
user_id     | integer   | not null, foreign key (references users), indexed
composition | text      | not null
public      | boolean   | not null, default true
original    | integer   | foreign key (references composition), indexed

## tags
column name | data type | details
------------|-----------|-----------------------
id          | integer   | not null, primary key
name        | string    | not null

## taggings
column name    | data type | details
---------------|-----------|-----------------------
id             | integer   | not null, primary key
composition_id | integer   | not null, foreign key (references composition), indexed, unique [tag_id]
tag_id         | integer   | not null, foreign key (references tags), indexed


## favorites
column name    | data type | details
---------------|-----------|-----------------------
id             | integer   | not null, primary key
composition_id | integer   | not null, foreign key (references composition), indexed, unique [user_id]
user_id        | integer   | not null, foreign key (references users), indexed
