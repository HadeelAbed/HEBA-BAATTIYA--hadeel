/**
 * Image manifest — curated Unsplash photography (Unsplash License: free for
 * commercial use, no attribution required) used as placeholder imagery
 * throughout the storefront. Swap these for real campaign photography when
 * the brand's own shoot is ready. Product image keys are stored on the
 * Product records in the database.
 */

const u = (id: string, w = 1400, q = 80) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`;

const l = (path: string) => encodeURI(path);

export const IMG = {
  blackDressPortrait: u("photo-1633994048003-071f6c11e26a"),
  blackBlazerDress: u("photo-1617182397327-a05d5c3e2abb"),
  blueWhiteDressHat: u("photo-1624352797845-056ba4427265"),
  bridalGown: u("photo-1525169224000-b178e48c91db"),
  // Local campaign image uploaded to public/Black_5.jpg
  limitedPiece5: l("/Black_5.jpg"),
  // Ready to Wear — 7 models from /تعديل/ subfolders
  // 1. أسود (Black)
  readToWear: l("/تعديل/تعديل/أسود/DSC_1357 copy.jpg"),
  readWear1A: l("/تعديل/تعديل/أسود/DSC_1357 copy.jpg"),
  readWear1B: l("/تعديل/تعديل/أسود/DSC_1392 copy.jpg"),
  readWear1C: l("/تعديل/تعديل/أسود/DSC_1515 copy.jpg"),
  // 2. احمر (Red)
  readWear2A: l("/تعديل/تعديل/احمر/DSC_6690 copy 2.jpg"),
  readWear2B: l("/تعديل/تعديل/احمر/DSC_6829 copy.jpg"),
  readWear2C: l("/تعديل/تعديل/احمر/DSC_6869 copy.jpg"),
  // 3. احمر محجب (Red Hijab)
  readWear3A: l("/تعديل/تعديل/احمر محجب/DSC_1849 copy 2.jpg"),
  readWear3B: l("/تعديل/تعديل/احمر محجب/DSC_1911 copy 2.jpg"),
  readWear3C: l("/تعديل/تعديل/احمر محجب/DSC_1924 copy 2.jpg"),
  // 4. اسود2 (Black 2)
  readWear4A: l("/تعديل/تعديل/اسود2/DSC_1588 copy 2.jpg"),
  readWear4B: l("/تعديل/تعديل/اسود2/DSC_1631 copy.jpg"),
  readWear4C: l("/تعديل/تعديل/اسود2/DSC_1793 copy.jpg"),
  // 5. افرهول (Jumpsuit)
  readWear5A: l("/تعديل/تعديل/افرهول/DSC_2022 copy.jpg"),
  readWear5B: l("/تعديل/تعديل/افرهول/DSC_2054 copy.jpg"),
  readWear5C: l("/تعديل/تعديل/افرهول/DSC_2101 copy.jpg"),
  // 6. بطيخي (Watermelon)
  readWear6A: l("/تعديل/تعديل/بطيخي/DSC_6581 copy.jpg"),
  readWear6B: l("/تعديل/تعديل/بطيخي/DSC_6582 copy.jpg"),
  readWear6C: l("/تعديل/تعديل/بطيخي/DSC_6590 copy.jpg"),
  // 7. زهري (Rose Pink)
  readWear7A: l("/تعديل/تعديل/زهري/DSC_6892 copy.jpg"),
  readWear7B: l("/تعديل/تعديل/زهري/DSC_6900 copy 2.jpg"),
  readWear7C: l("/تعديل/تعديل/زهري/DSC_6911 copy.jpg"),
  blackDressA: l("/Collection 1/black dress/photo/Black_5.jpg"),
  blackDressB: l("/Collection 1/black dress/photo/Black_3.jpg"),
  blackDressC: l("/Collection 1/black dress/photo/Black_1.jpg"),
  blackDressD: l("/Collection 1/black dress/photo/Black_4.jpg"),
  blackDressE: l("/Collection 1/black dress/photo/Black_5.jpg"),
  blackDressF: l("/Collection 1/black dress/photo/Black_1 2.jpg"),
  blueDressA: l("/Collection 1/blue dress/photo/Blue_4.jpg"),
  blueDressB: l("/Collection 1/blue dress/photo/Blue_3.jpg"),
  blueDressC: l("/Collection 1/blue dress/photo/Blue_2.jpg"),
  blueDressD: l("/Collection 1/blue dress/photo/Blue_1.jpg"),
  blueDressE: l("/Collection 1/blue dress/photo/Blue_5.jpg"),
  blueDressF: l("/Collection 1/blue dress/photo/Blue_1 2.jpg"),
  peachDressA: l("/Collection 1/peach dress/photo/Peach_1.jpg"),
  peachDressB: l("/Collection 1/peach dress/photo/Peach_5.jpg"),
  peachDressC: l("/Collection 1/peach dress/photo/Peach_3.jpg"),
  peachDressD: l("/Collection 1/peach dress/photo/Peach_4.jpg"),
  peachDressE: l("/Collection 1/peach dress/photo/Peach_2.jpg"),
  peachDressF: l("/Collection 1/peach dress/photo/Peach_1 2.jpg"),
  pinkDressA: l("/Collection 1/pink dress/photo/OW_1.jpg"),
  pinkDressB: l("/Collection 1/pink dress/photo/OW_2.jpg"),
  pinkDressC: l("/Collection 1/pink dress/photo/OW_3.jpg"),
  pinkDressD: l("/Collection 1/pink dress/photo/OW_4.jpg"),
  pinkDressE: l("/Collection 1/pink dress/photo/OW_5.jpg"),
  pinkDressF: l("/Collection 1/pink dress/photo/OW_6.jpg"),
  pinkDressG: l("/Collection 1/pink dress/photo/OW_7.jpg"),
  pinkDressH: l("/Collection 1/pink dress/photo/OW_1 2.jpg"),
  redDressA: l("/Collection 1/Red Dress/Photos/Red_1.jpg"),
  redDressB: l("/Collection 1/Red Dress/Photos/Red_2.jpg"),
  redDressC: l("/Collection 1/Red Dress/Photos/Red_3.jpg"),
  redDressD: l("/Collection 1/Red Dress/Photos/Red_4.jpg"),
  redDressE: l("/Collection 1/Red Dress/Photos/Red_1 2.jpg"),
} as const;

export type ImageKey = keyof typeof IMG;

// Wide hero / editorial crops (taller aspect for full-bleed sections)
export const HERO_IMG = {
  heroMain: l("/hero-heba.jpg"),
  editorialOne: u("photo-1617182397327-a05d5c3e2abb", 1800, 85),
  editorialTwo: u("photo-1525169224000-b178e48c91db", 1800, 85),
  editorialThree: u("photo-1624352797845-056ba4427265", 1800, 85),
} as const;
