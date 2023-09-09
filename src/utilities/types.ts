// create table
//   public.fields (
//     id uuid not null default gen_random_uuid (),
//     created_at timestamp with time zone not null default now(),
//     code text not null,
//     name text not null,
//     description text null,
//     max_dry_days bigint null,
//     rainfall_days real null,
//     last_painted timestamp without time zone null,
//     archived smallint null default '0'::smallint,
//     should_paint double precision not null default '0'::double precision,
//     size text not null default 'full'::text,
//     custom_width bigint null,
//     custom_length bigint null,
//     sort_order bigint null default '0'::bigint,
//     marked_unplayable timestamp without time zone null,
//     constraint fields_pkey primary key (id)
//   ) tablespace pg_default;

export type Field = {
  id: string
  createdAt: Date
  size: string
  customWidth?: number
  customLength?: number
  code: string
  name: string
  description: string
  /**
   * The number of days a typical field will need to be repainted
   * regardless of rainfall
   */
  maxDryDays: number
  /**
   * Number of days that had significant rain since the last painting
   */
  rainfallDays: number
  /**
   * The effect that a day of rain has on the field
   * 1 = 1 day of rainfall = 1 less day of playable field
   * This number is adjusted when we click the "Unplayable" button UNLESS there hasn't been any rainfall
   */
  rainfallFactor: number
  lastPainted: Date
  /**
   * Predicted amount of days until it needs to be painted again
   * <=0 = needs to be painted
   */
  shouldPaint: number
  archived: boolean
  /**
   * The date the field was marked unplayable
   * This allows us to determine what the maxDryDays should be
   */
  markedUnplayable: Date
  sortOrder: number
  active?: boolean
}

export enum FieldSize {
  full = 'Full',
  elevenThirteen = '11/13',
  nineTen = '9/10',
  sevenEight = '7/8',
}
