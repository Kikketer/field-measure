/*
create table
  public.fields (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    code character varying not null,
    name character varying not null,
    description text null,
    degrade_factor bigint null,
    rainfall_total real null,
    last_painted timestamp without time zone null,
    playable smallint not null default '1'::smallint,
    archived smallint null default '0'::smallint,
    paint_factor double precision not null default '0'::double precision,
    constraint fields_pkey primary key (id)
  ) tablespace pg_default;
  */
export type Field = {
  id: string
  created_at: string
  code: string
  name: string
  description: string
  degrade_factor: number
  rainfall_total: number
  last_painted: string
  playable: number
  archived: number
  paint_factor: number
}

export enum FieldSize {
  full = 'Full',
  elevenThirteen = '11/13',
  nineTen = '9/10',
  sevenEight = '7/8',
}
