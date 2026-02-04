// ============================================================================
// Home Page Type Definitions
// These interfaces define the shape of data used on the Home page
// ============================================================================

/**
 * Represents the hero/header section
 */
export interface Hero {
  title: string;
  subtitle: string;
}

/**
 * Represents the "What is DishDash?" section
 */
export interface WhatIsDishDash {
  title: string;
  paragraphs: string[];
}

/**
 * Represents a feature card on the home page
 */
export interface Feature {
  id: number;
  icon: string;
  color: string;
  title: string;
  description: string;
}

/**
 * Represents the features section with title and items
 */
export interface FeaturesSection {
  title: string;
  features: Feature[];
}

/**
 * Represents a step in the "How It Works" section
 */
export interface HowItWorksStep {
  id: number;
  stepNumber: number;
  title: string;
  description: string;
}

/**
 * Represents the "How It Works" section with title and steps
 */
export interface HowItWorksSection {
  title: string;
  steps: HowItWorksStep[];
}

/**
 * Represents a benefit item in the benefits list
 */
export interface Benefit {
  id: number;
  text: string;
}

/**
 * Represents the benefits section with title and items
 */
export interface BenefitsSection {
  title: string;
  benefits: Benefit[];
}

/**
 * Represents the call to action section
 */
export interface CallToAction {
  title: string;
  text: string;
}

/**
 * The complete home page content structure
 */
export interface HomeContent {
  hero: Hero;
  whatIsDishDash: WhatIsDishDash;
  featuresSection: FeaturesSection;
  howItWorksSection: HowItWorksSection;
  benefitsSection: BenefitsSection;
  callToAction: CallToAction;
}
