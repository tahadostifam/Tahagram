CREATE TABLE public.tbl_rooms (
	room_id text NOT NULL,
	title text NOT NULL,
	description text NULL,
	room_type text NOT NULL,
	room_username text NOT NULL,
	CONSTRAINT tbl_rooms_pk PRIMARY KEY (room_id),
	CONSTRAINT tbl_rooms_un UNIQUE (room_id),
	CONSTRAINT tbl_rooms_un UNIQUE (room_username)
);