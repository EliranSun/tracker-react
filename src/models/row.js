class Row {
  constructor({
    energy,
    water,
    eating,
    shower,
    sugar,
    coffee,
    creative,
    date,
    family,
    porn,
    productivity,
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
    nap,
    media
  } = {}) {
    this.date = date;
    this.energy = energy || [];
    
    // activities
    this.productivity = productivity || 0;
    this.creative = creative || 0;
    this.social = social || 0;
    this.youtube = youtube || 0;
    this.outside = outside || 0;
    this.nap = nap || 0;
    this.family = family || 0;
    this.media = media || 0;
    
    // consumption
    this.water = water || [];
    this.eating = eating || [];
    this.shower = shower || [];
    this.sugar = sugar || [];
    this.coffee = coffee || [];
    
    // sleep
    this.wentToBed = went_to_bed || "";
    this.wokeUp = woke_up || "";
    this.snooze = snooze || false;
    this.wokeUpMidNight = woke_up_mid_night || false;
    
    // well-being
    this.workLate = work_late || false;
    this.stuffed = stuffed || false;
    this.workout = workout || false;
    this.porn = porn || false;
    this.sick = sick || false;
    this.alcohol = alcohol || false;
    this.keto = keto || false;
  }
}

export default Row;
