import { type Interest } from '../lib/site';
import type { PhotoKey } from '../lib/images';
export const longevityServices: { title: string; body: string; cta: string; href: string; interest: Interest; photo: PhotoKey }[] = [
  { title: 'Longevity Evaluation', body: 'Start with a review of your health history, concerns and goals. Appropriate testing helps inform a personalized plan for healthy aging.', cta: 'Explore', href: '/longevity/evaluation', interest: 'longevity', photo: 'svcEval' },
  { title: 'Metabolic Health and Medical Weight Management', body: 'Address weight and metabolic health with nutrition, lifestyle support and medication when appropriate. We focus on sustainable progress and ongoing monitoring.', cta: 'Explore', href: '/longevity/metabolic-health', interest: 'metabolic', photo: 'svcMetabolic' },
  { title: 'Hormone Care', body: 'Individualized evaluation for men and women experiencing symptoms that may be related to hormonal changes. Treatment options, including testosterone or menopausal hormone therapy when appropriate, are discussed with your clinician.', cta: 'Explore', href: '/longevity/hormone-care', interest: 'hormone', photo: 'svcHormone' },
  { title: 'Functional Medicine', body: 'Explore how nutrition, sleep, stress, digestive health and medical conditions may contribute to your symptoms. We develop an individualized care plan grounded in your clinical needs.', cta: 'Explore', href: '/longevity/functional-medicine', interest: 'longevity', photo: 'svcFunctional' },
];
export const pillars = [
  { title: 'Mindset', body: 'Stress, sleep, habits and the practical support needed to make lasting changes.', icon: 'moon' },
  { title: 'Inflammation', body: 'Medical history, lifestyle and relevant testing to investigate potential contributors to inflammation.', icon: 'flame' },
  { title: 'Gut Health', body: 'Digestive symptoms, nutrition and targeted evaluation when clinically appropriate.', icon: 'gut' },
  { title: 'Hormone Care', body: 'Symptoms, medical history and appropriate testing to determine whether treatment is indicated.', icon: 'drop' },
  { title: 'Metabolic Health', body: 'Weight, body composition, blood pressure, glucose regulation and cardiovascular risk.', icon: 'heart' },
];
export const steps = [
  { n: 1, title: 'Consult', body: 'Tell us what matters to you. We review your goals, symptoms and health history.' },
  { n: 2, title: 'Evaluate', body: 'Your clinician recommends an examination and testing where appropriate, then reviews the findings with you.' },
  { n: 3, title: 'Personalize', body: 'Together, we develop a plan that may include nutrition, exercise, sleep strategies and medical treatments when indicated.' },
  { n: 4, title: 'Follow up', body: 'We monitor progress, discuss how you feel and adjust your plan as your needs change.' },
];
export const aestheticsLine = ['Botox', 'Dysport', 'Dermal Fillers', 'Sculptra', 'Microneedling', 'Medical-Grade Skincare'];
