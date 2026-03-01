export interface Hero {
  title: string;
  subtitle: string;
}

export interface WhatIsDishDash {
  title: string;
  paragraphs: string[];
}

export interface Feature {
  id: number;
  icon: string;
  color: string;
  title: string;
  description: string;
}

export interface FeaturesSection {
  title: string;
  features: Feature[];
}

export interface HowItWorksStep {
  id: number;
  stepNumber: number;
  title: string;
  description: string;
}

export interface HowItWorksSection {
  title: string;
  steps: HowItWorksStep[];
}

export interface Benefit {
  id: number;
  text: string;
}

export interface BenefitsSection {
  title: string;
  benefits: Benefit[];
}

export interface CallToAction {
  title: string;
  text: string;
}

export interface HomeContent {
  hero: Hero;
  whatIsDishDash: WhatIsDishDash;
  featuresSection: FeaturesSection;
  howItWorksSection: HowItWorksSection;
  benefitsSection: BenefitsSection;
  callToAction: CallToAction;
}
