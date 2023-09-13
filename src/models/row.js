/*
creative bigint null default '0'::bigint,
    date text null default ''::text,
    energy bigint null default '0'::bigint,
    family bigint null default '0'::bigint,
    last_coffee text null default '14:00'::text,
    last_eat text null default '20:00'::text,
    last_water text null default '22:00'::text,
    porn boolean null default false,
    productivity bigint null default '0'::bigint,
    shower text null default '20:00'::text,
    sick boolean null default false,
    snooze boolean null default false,
    social bigint null default '0'::bigint,
    alcohol boolean null default false,
    keto boolean null default false,
    went_to_bed text null default '23:00'::text,
    woke_up text null default '07:00'::text,
    woke_up_mid_night boolean null default false,
    work_late boolean null default false,
    stuffed boolean null default false,
    workout boolean null default false,
    youtube bigint null default '0'::bigint,
    outside bigint null default '0'::bigint,
    sugar text null,
    nap boolean null,
*/
class Row {
  constructor({
    creative,
    date,
    energy,
    family,
    last_coffee,
    last_eat,
    last_water,
    porn,
    productivity,
    shower,
    sick,
    snooze,
    social,
    alcohol,
    keto,
    went_to_bed,
    woke_up,
    woke_up_mid_night,
    work_late,
    stuffed,
    workout,
    youtube,
    outside,
    sugar,
    nap,
  }) {
    this.date = date;
    this.energy = energy || 5;
    this.lastCoffee = last_coffee || "";
    this.productivity = productivity || 0;
    this.creative = creative || 0;
    this.social = social || 0;
    this.wentToBed = went_to_bed || "";
    this.wokeUp = woke_up || "";
    this.snooze = snooze || false;
    this.wokeUpMidNight = woke_up_mid_night || false;
    this.workLate = work_late || false;
    this.stuffed = stuffed || false;
    this.workout = workout || false;
    this.youtube = youtube || 0;
    this.outside = outside || 0;
    this.sugar = sugar || "";
    this.nap = nap || 0;
    this.family = family || 0;
    this.lastEat = last_eat || "";
    this.lastWater = last_water || "";
    this.porn = porn || false;
    this.shower = shower || "";
    this.sick = sick || false;
    this.alcohol = alcohol || false;
    this.keto = keto || false;
  }
}

export default Row;
