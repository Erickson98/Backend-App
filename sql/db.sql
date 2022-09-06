create database AppCrud;

use AppCrud;

create table People(
	_id binary(16) not null,
    Name varchar(30) not null,
    LastName varchar(30) not null,
    Data datetime not null,
    id varchar(30) not null,
    Address varchar(30) not null,  
    primary key (_id) on delete cascade 
);
create table Roles(
	_id binary(16) not null,
    Name varchar(30) not null, 
    Rol varchar(30) not null,  
    primary key (_id) on delete cascade 
);
create table User(
	_id binary(16) not null,
    Name varchar(30) not null, 
    Rol varchar(30) not null,  
    primary key (_id) on delete cascade 
);
select * from People;
select * from Roles;

drop database AppCrud;