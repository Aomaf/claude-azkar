import type { AzkarMode } from '../types'

export type Dhikr = { id: string; ar: string; en: string; target: number }

export const GENERAL: readonly Dhikr[] = [
  { id: 'subhanallah', ar: 'سُبْحَانَ اللَّهِ', en: 'Glory be to Allah', target: 33 },
  { id: 'alhamdulillah', ar: 'الْحَمْدُ لِلَّهِ', en: 'All praise is due to Allah', target: 33 },
  { id: 'allahuakbar', ar: 'اللَّهُ أَكْبَرُ', en: 'Allah is the Greatest', target: 34 },
  {
    id: 'tahlil',
    ar: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    en: 'None is worthy of worship but Allah alone, without partner',
    target: 10,
  },
  {
    id: 'istighfar',
    ar: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    en: 'I seek Allah’s forgiveness and turn to Him in repentance',
    target: 100,
  },
  {
    id: 'hawqala',
    ar: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    en: 'There is no might nor power except with Allah',
    target: 10,
  },
  {
    id: 'salawat',
    ar: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
    en: 'O Allah, send prayers and peace upon our Prophet Muhammad',
    target: 10,
  },
  {
    id: 'subhanallah-azim',
    ar: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    en: 'Glory and praise be to Allah; glory be to Allah the Almighty',
    target: 10,
  },
  {
    id: 'yunus',
    ar: 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    en: 'There is no god but You, glory be to You; I have been among the wrongdoers',
    target: 3,
  },
  {
    id: 'rabbighfirli',
    ar: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',
    en: 'My Lord, forgive me and accept my repentance; You are the Accepting, the Merciful',
    target: 10,
  },
]

// Said both morning and evening (Hisn al-Muslim).
const BOTH: readonly Dhikr[] = [
  {
    id: 'bismillah-la-yadur',
    ar: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    en: 'In the name of Allah, with whose name nothing on earth or in heaven can cause harm; He is the All-Hearing, the All-Knowing',
    target: 3,
  },
  {
    id: 'raditu',
    ar: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا',
    en: 'I am pleased with Allah as my Lord, Islam as my religion and Muhammad ﷺ as my Prophet',
    target: 3,
  },
  {
    id: 'hasbiyallah',
    ar: 'حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    en: 'Allah is sufficient for me; there is no god but Him. In Him I trust, and He is Lord of the Mighty Throne',
    target: 7,
  },
  {
    id: 'ya-hayyu',
    ar: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ',
    en: 'O Ever-Living, O Sustainer, by Your mercy I seek help: set right all my affairs and leave me not to myself for the blink of an eye',
    target: 1,
  },
  {
    id: 'afw-afiya',
    ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ',
    en: 'O Allah, I ask You for pardon and well-being in this world and the Hereafter',
    target: 1,
  },
  { id: 'subhanallah-wabihamdihi', ar: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', en: 'Glory and praise be to Allah', target: 100 },
]

const MORNING: readonly Dhikr[] = [
  {
    id: 'asbahna',
    ar: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ',
    en: 'We have entered the morning, and all dominion belongs to Allah; all praise is His',
    target: 1,
  },
  {
    id: 'allahumma-bika-asbahna',
    ar: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
    en: 'O Allah, by You we enter the morning and the evening, by You we live and die, and to You is the resurrection',
    target: 1,
  },
  {
    id: 'fitra-morning',
    ar: 'أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ',
    en: 'We have entered the morning upon the natural way of Islam and the word of sincerity',
    target: 1,
  },
  {
    id: 'adada-khalqihi',
    ar: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ',
    en: 'Glory and praise be to Allah, as many as His creation, as He is pleased, the weight of His Throne and the ink of His words',
    target: 3,
  },
]

const EVENING: readonly Dhikr[] = [
  {
    id: 'amsayna',
    ar: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ',
    en: 'We have entered the evening, and all dominion belongs to Allah; all praise is His',
    target: 1,
  },
  {
    id: 'allahumma-bika-amsayna',
    ar: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
    en: 'O Allah, by You we enter the evening and the morning, by You we live and die, and to You is the return',
    target: 1,
  },
  {
    id: 'fitra-evening',
    ar: 'أَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ',
    en: 'We have entered the evening upon the natural way of Islam and the word of sincerity',
    target: 1,
  },
  {
    id: 'kalimat-tammat',
    ar: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    en: 'I seek refuge in the perfect words of Allah from the evil of what He created',
    target: 3,
  },
]

export type AzkarSet = { name: Exclude<AzkarMode, 'auto'>; label: string; list: readonly Dhikr[] }

const SETS: Record<AzkarSet['name'], AzkarSet> = {
  morning: { name: 'morning', label: 'أذكار الصباح · Morning', list: [...MORNING, ...BOTH, ...GENERAL] },
  evening: { name: 'evening', label: 'أذكار المساء · Evening', list: [...EVENING, ...BOTH, ...GENERAL] },
  general: { name: 'general', label: 'أذكار · Dhikr', list: GENERAL },
}

// Morning azkar run from Fajr to before Dhuhr, evening from Asr to Isha;
// without prayer times, local clock windows stand in for both.
export function pickSet(hour: number, mode: AzkarMode = 'auto'): AzkarSet {
  if (mode !== 'auto') {
    return SETS[mode]
  }

  if (hour >= 4 && hour < 12) {
    return SETS.morning
  }

  if (hour >= 15 && hour < 22) {
    return SETS.evening
  }

  return SETS.general
}

export function nextAfter(list: readonly Dhikr[], id: string): Dhikr {
  const at = list.findIndex(one => one.id === id)

  return list[(at + 1) % list.length] ?? list[0]!
}
