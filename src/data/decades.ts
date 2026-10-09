// Copy from brief, section 9. (The brief starts at the 30s; there is no 20s tab.)
export interface Decade { id: string; tab: string; big: string; title: string; body: string; photo: 'd30'|'d40'|'d50'|'d60'|'d70' }
export const decades: Decade[] = [
  { id: '30s', tab: "30's", big: "30's", title: 'Build a foundation', body: 'Nutrition, physical activity, sleep and preventive health habits.', photo: 'd30' },
  { id: '40s', tab: "40's", big: "40's", title: 'Reassess your priorities', body: 'Body composition, metabolic health, cardiovascular risk and symptoms related to hormonal changes.', photo: 'd40' },
  { id: '50s', tab: "50's", big: "50's", title: 'Protect your function', body: 'Muscle and bone health, metabolic risk, hormone symptoms and maintaining physical capacity.', photo: 'd50' },
  { id: '60s', tab: "60's", big: "60's", title: 'Stay strong and active', body: 'Strength, mobility, cardiovascular health and sustaining daily function.', photo: 'd60' },
  { id: '70s', tab: '70 and beyond', big: '70+', title: 'Support independence', body: 'Mobility, function, medication review and care aligned with your priorities.', photo: 'd70' },
];
