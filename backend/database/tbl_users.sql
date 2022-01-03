CREATE TABLE public.tbl_users (
	full_name text NOT NULL,
	username text NOT NULL,
	password_digest text NOT NULL,
	bio text NULL,
	last_seen text NOT NULL,
	CONSTRAINT tbl_users_pk PRIMARY KEY (username)
);

CREATE UNIQUE INDEX tbl_users_username_idx ON public.tbl_users (username);