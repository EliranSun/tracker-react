class Row {
  constructor({
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
  }) {
    this.date = date;
    
    this.productivity = productivity || 0;
    this.creative = creative || 0;
    this.social = social || 0;
    this.youtube = youtube || 0;
    this.outside = outside || 0;
    this.nap = nap || 0;
    this.family = family || 0;
    
    this.wentToBed = went_to_bed || "";
    this.wokeUp = woke_up || "";
    
    this.snooze = snooze || false;
    this.wokeUpMidNight = woke_up_mid_night || false;
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
