CREATE TABLE public.tbl_chats_list (
	haver_username text NOT NULL,
	user_id text NOT NULL,
	CONSTRAINT tbl_chats_list_pk PRIMARY KEY (haver_username,user_id),
	CONSTRAINT tbl_chats_list_un UNIQUE (haver_username,user_id)
);