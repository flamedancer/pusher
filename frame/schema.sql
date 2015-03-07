drop table if exists entries;
create table entries (
  id integer primary key autoincrement,
  username text not null,
  text text not null,
  time text not null
);
create table admins (
  id integer primary key autoincrement,
  username text not null UNIQUE,
  password text  not null
);
